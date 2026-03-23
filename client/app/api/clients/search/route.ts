// app/api/clients/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/app/utils/server-session.util";
import { InvoiceStatus } from "@/generated/prisma";

// ── Types ──────────────────────────────────────────────────────────────────

export type PaymentHealth = "good" | "fair" | "at-risk" | "new";

export type ClientSummary = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  invoiceCount: number;
  lifetimeValue: number;
  outstanding: number;
  avgPayTimeDays: number | null;
  health: PaymentHealth;
};

// ── Health classification ──────────────────────────────────────────────────
//
// Thresholds (adjust freely as you gather real data):
//   new      → no paid invoices on record
//   good     → avg pay time ≤ 7 days
//   fair     → avg pay time 8–14 days
//   at-risk  → avg pay time > 14 days OR has at least one overdue invoice

const TAB_VALUES = ["all", "good", "fair", "at-risk", "new"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function classifyHealth(
  client: {
    createdAt: Date;
    invoiceCount: number;
    avgPayTimeDays: number | null;
    hasOverdue: boolean;
  }
): PaymentHealth {
  const now = new Date();
  const daysSinceCreation =
    (now.getTime() - client.createdAt.getTime()) / (1000 * 60 * 60 * 24);

  // At-risk is evaluated first and overrides everything —
  // an overdue invoice is a signal regardless of client age or pay history
  if (client.hasOverdue) return "at-risk";
  if (client.avgPayTimeDays !== null && client.avgPayTimeDays > 14) return "at-risk";

  // New: not enough time or activity to form a meaningful signal.
  // Both conditions must be true — a 90-day-old client with 1 invoice
  // has low activity but is not new. A 2-week-old client with 5 invoices
  // has enough activity to classify properly.
  const NEW_WINDOW_DAYS = 30;
  const NEW_INVOICE_THRESHOLD = 2;
  if (
    daysSinceCreation <= NEW_WINDOW_DAYS &&
    client.invoiceCount < NEW_INVOICE_THRESHOLD
  ) {
    return "new";
  }

  // Pay-time classification — only reached when enough history exists
  // and no overdue signals are present
  if (client.avgPayTimeDays === null) return "fair"; // old client, no paid invoices yet
  if (client.avgPayTimeDays <= 7) return "good";
  return "fair";
}

// ── Route handler ────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q")?.trim() ?? "";
    const tab = (searchParams.get("tab") ?? "all") as TabValue;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = 12;
    const now = new Date();

    const UNPAID_STATUSES = new Set<InvoiceStatus>([InvoiceStatus.DUE, InvoiceStatus.OVERDUE]);

    if (!TAB_VALUES.includes(tab)) {
      return NextResponse.json({ error: "Invalid tab value" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 1. Fetch all clients matching the search query ─────────────────────
    //
    // We must fetch all (no skip/take yet) because health is computed in
    // memory — we don't know which page a filtered subset occupies until
    // after we've classified every client.
    //
    // For very large client lists this is a reasonable trade-off at SME
    // scale. If you ever exceed ~10k clients per business, switch to a
    // stored `healthScore` column that gets updated on invoice status changes.
    const rawClients = await prisma.client.findMany({
      where: {
        businessId: {
          // Scope to the authenticated user's businesses
          in: await prisma.business
            .findMany({
              where: { ownerId: session.user.id },
              select: { id: true },
            })
            .then((bs) => bs.map((b) => b.id)),
        },
        // Search filter — applied in DB so we only load relevant rows
        ...(query.length > 0
          ? {
              name: {
                contains: query,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        invoices: {
          include: {
            items: { select: { units: true, price: true } },
            payments: { select: { amount: true } },
          },
        },
      },
    });

    // ── 2. Compute stats and health for every client ───────────────────────
    const enriched: ClientSummary[] = rawClients.map((client) => {
      const lifetimeValue = client.invoices.reduce(
        (total, invoice) =>
          total +
          invoice.payments.reduce((sum, p) => sum + p.amount, 0),
        0
      );

      const outstanding = client.invoices
        .filter((inv) => UNPAID_STATUSES.has(inv.status))
        .reduce(
          (total, invoice) =>
            total +
            invoice.items.reduce((sum, item) => sum + item.units * item.price, 0),
          0
        );

      // Overdue = dueDate is in the past, regardless of stored status
      const hasOverdue = client.invoices.some(
        (inv) =>
          UNPAID_STATUSES.has(inv.status) && inv.dueDate < now
      );

      const paidInvoices = client.invoices.filter(
        (inv) => inv.status === InvoiceStatus.PAID && inv.paidDate !== null
      );

      let avgPayTimeDays: number | null = null;

      if (paidInvoices.length > 0) {
        const totalDays = paidInvoices.reduce(
          (sum, inv) =>
            sum +
            (inv.paidDate!.getTime() - inv.issueDate.getTime()) /
              (1000 * 60 * 60 * 24),
          0
        );
        avgPayTimeDays = Math.round(totalDays / paidInvoices.length);
      }

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        createdAt: client.createdAt,
        invoiceCount: client.invoices.length,
        lifetimeValue,
        outstanding,
        avgPayTimeDays,
        health: classifyHealth({
          avgPayTimeDays,
          createdAt: client.createdAt,
          invoiceCount: client.invoices.length,
          hasOverdue
        }),
      };
    });

    // ── 3. Apply health tab filter ─────────────────────────────────────────
    const filtered =
      tab === "all"
        ? enriched
        : enriched.filter((c) => c.health === tab);

    // ── 4. Paginate ────────────────────────────────────────────────────────
    const total = filtered.length;
    const clients = filtered.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
      clients,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/clients]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}