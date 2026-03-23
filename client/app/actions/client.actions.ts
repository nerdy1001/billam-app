// actions/client-stats.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { InvoiceStatus } from "../../generated/prisma";
import { clientDetailsSchema } from "@/lib/validations/client-details.validation";
import z from "zod";

export type TrendDirection = "up" | "down" | "neutral";

export type StatSubtitle = {
  label: string;
  trend: TrendDirection;
};

type StatWithSubtitle<T> = {
  value: T;
  subtitle: StatSubtitle;
};

export type ClientDashboardStats = {
  totalClients: {
    count: number;
    subtitle: StatSubtitle;
  };
  totalBilled: {
    amount: number;
    subtitle: StatSubtitle;
  };
  outstanding: {
    amount: number;
    subtitle: StatSubtitle;
  };
  avgPayTime: {
    days: number | null;
    subtitle: StatSubtitle;
  };
};

export type ClientInvoiceSummary = {
  id: string;
  invoiceNo: string;
  projectName: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate: Date | null;
  total: number;
  amountPaid: number;
  outstanding: number;
};

export type ClientDetails = {
  // ── Identity ──────────────────────────────────────────────────
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  createdAt: Date;

  // ── Stats with subtitle data ───────────────────────────────────
  lifetimeValue: StatWithSubtitle<number>;
  outstanding: StatWithSubtitle<number>;
  avgPayTimeDays: StatWithSubtitle<number | null>;
  totalInvoices: StatWithSubtitle<number>;

  // ── Invoice list ───────────────────────────────────────────────
  invoices: ClientInvoiceSummary[];

  // ── Derived signals ────────────────────────────────────────────
  hasOverdue: boolean;
  overdueCount: number;
  unpaidCount: number;
};

export type GetClientStatsResult =
  | { success: true; stats: ClientDashboardStats }
  | { success: false; error: string };

export type GetClientResult =
  | { success: true; client: ClientDetails }
  | { success: false; error: string; status: 401 | 403 | 404 | 500 };

export type UpdateClientResult =
  | { success: true; client: { id: string; name: string } }
  | { success: false; error: string; status: 401 | 403 | 404 | 422 | 500 };

// ── helpers ────────────────────────────────────────────────
function startOf(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function avgDays(
  invoices: { issueDate: Date; paidDate: Date | null }[]
): number | null {
  const paid = invoices.filter((inv) => inv.paidDate !== null);
  if (!paid.length) return null;
  const total = paid.reduce(
    (sum, inv) =>
      sum +
      (inv.paidDate!.getTime() - inv.issueDate.getTime()) /
        (1000 * 60 * 60 * 24),
    0
  );
  return Math.round(total / paid.length);
}

// ── Action ─────────────────────────────────────────────────────────────────

export async function getClient(clientId: string): Promise<GetClientResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }

    const now = new Date();
    const thisMonthStart = startOf(now);
    const lastMonthStart = startOf(
      new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );

    const UNPAID_STATUSES = new Set<InvoiceStatus>([
      InvoiceStatus.DUE,
      InvoiceStatus.OVERDUE,
    ]);

    // ── Fetch client and verify ownership in one query ─────────────────────
    // The business.ownerId check ensures a user cannot access another
    // business's client by guessing a clientId.
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        business: {
          select: { ownerId: true },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          include: {
            items: { select: { units: true, price: true } },
            payments: { select: { amount: true, paidAt: true } },
          },
        },
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", status: 404 };
    }

    if (client.business.ownerId !== session.user.id) {
      return { success: false, error: "Forbidden", status: 403 };
    }

    // ── Compute per-invoice totals ─────────────────────────────────────────
    const invoiceSummaries: ClientInvoiceSummary[] = client.invoices.map(
      (invoice) => {
        const total = invoice.items.reduce(
          (sum, item) => sum + item.units * item.price,
          0
        );
        const amountPaid = invoice.payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        return {
          id: invoice.id,
          clientName: invoice.clientName,
          items: invoice.items,
          invoiceNo: invoice.invoiceNo,
          projectName: invoice.projectName,
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          paidDate: invoice.paidDate,
          total,
          amountPaid,
          // Partial payment aware: outstanding = total - what has been paid,
          // but only for unpaid invoices. Paid invoices have 0 outstanding.
          outstanding: UNPAID_STATUSES.has(invoice.status)
            ? Math.max(0, total - amountPaid)
            : 0,
        };
      }
    );

    // ── Lifetime value ─────────────────────────────────────────────────────
    const lifetimeValue = client.invoices.reduce(
      (total, invoice) =>
        total + invoice.payments.reduce((sum, p) => sum + p.amount, 0),
      0
    );

    // Lifetime value this month vs last month for subtitle
    const billedThisMonth = client.invoices
      .filter((inv) => inv.paidDate && inv.paidDate >= thisMonthStart)
      .reduce(
        (sum, inv) => sum + inv.payments.reduce((s, p) => s + p.amount, 0),
        0
      );

    const billedLastMonth = client.invoices
      .filter(
        (inv) =>
          inv.paidDate &&
          inv.paidDate >= lastMonthStart &&
          inv.paidDate < thisMonthStart
      )
      .reduce(
        (sum, inv) => sum + inv.payments.reduce((s, p) => s + p.amount, 0),
        0
      );

    const billedPct = pctChange(billedThisMonth, billedLastMonth);

    // ── Outstanding ────────────────────────────────────────────────────────
    const outstandingTotal = invoiceSummaries.reduce(
      (sum, inv) => sum + inv.outstanding,
      0
    );

    const overdueInvoices = invoiceSummaries.filter(
      (inv) => UNPAID_STATUSES.has(inv.status) && inv.dueDate < now
    );
    const overdueCount = overdueInvoices.length;
    const unpaidCount = invoiceSummaries.filter((inv) =>
      UNPAID_STATUSES.has(inv.status)
    ).length;

    // ── Avg pay time ───────────────────────────────────────────────────────
    // All paid invoices — used for the headline value
    const paidInvoices = client.invoices.filter(
      (inv) => inv.status === InvoiceStatus.PAID && inv.paidDate !== null
    );

    // Split by month window for the subtitle trend
    const paidThisMonth = paidInvoices.filter(
      (inv) => inv.paidDate! >= thisMonthStart
    );
    const paidLastMonth = paidInvoices.filter(
      (inv) =>
        inv.paidDate! >= lastMonthStart && inv.paidDate! < thisMonthStart
    );

    const avgPayTime = avgDays(paidInvoices);
    const avgThisMonth = avgDays(paidThisMonth);
    const avgLastMonth = avgDays(paidLastMonth);

    // Lower avg = better (faster payer), so "up" trend means improvement
    function payTimeTrend(
      current: number | null,
      previous: number | null
    ): TrendDirection {
      if (current === null || previous === null) return "neutral";
      if (current < previous) return "up";
      if (current > previous) return "down";
      return "neutral";
    }

    function payTimeLabel(
      current: number | null,
      previous: number | null
    ): string {
      if (current === null) return "No paid invoices yet";
      if (previous === null) return `${current}d average`;
      const diff = Math.abs(current - previous);
      if (diff === 0) return "Same as last month";
      return `${current < previous ? "Faster" : "Slower"} by ${diff}d vs last month`;
    }

    // ── Total invoices ─────────────────────────────────────────────────────
    const totalInvoices = client.invoices.length;

    // Invoices created this month vs last month for subtitle
    const invoicesThisMonth = client.invoices.filter(
      (inv) => inv.createdAt >= thisMonthStart
    ).length;
    const invoicesLastMonth = client.invoices.filter(
      (inv) =>
        inv.createdAt >= lastMonthStart && inv.createdAt < thisMonthStart
    ).length;

    // ── Assemble ───────────────────────────────────────────────────────────
    const details: ClientDetails = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone!,
      address: client.address,
      createdAt: client.createdAt,

      lifetimeValue: {
        value: lifetimeValue,
        subtitle: {
          trend: billedPct > 0 ? "up" : billedPct < 0 ? "down" : "neutral",
          label:
            billedLastMonth === 0 && billedThisMonth === 0
              ? "No payments received yet"
              : billedLastMonth === 0
              ? `₦${billedThisMonth.toLocaleString()} received this month`
              : `${billedPct > 0 ? "+" : ""}${billedPct}% vs last month`,
        },
      },

      outstanding: {
        value: outstandingTotal,
        subtitle: {
          trend: overdueCount > 0 ? "down" : unpaidCount > 0 ? "neutral" : "up",
          label:
            unpaidCount === 0
              ? "All invoices settled"
              : overdueCount > 0
              ? `${overdueCount} overdue · ${unpaidCount} total unpaid`
              : `${unpaidCount} invoice${unpaidCount !== 1 ? "s" : ""} unpaid`,
        },
      },

      avgPayTimeDays: {
        value: avgPayTime,
        subtitle: {
          trend: payTimeTrend(avgThisMonth, avgLastMonth),
          label: payTimeLabel(avgThisMonth, avgLastMonth),
        },
      },

      totalInvoices: {
        value: totalInvoices,
        subtitle: {
          trend:
            invoicesThisMonth > invoicesLastMonth
              ? "up"
              : invoicesThisMonth < invoicesLastMonth
              ? "down"
              : "neutral",
          label:
            invoicesThisMonth === 0
              ? "None this month"
              : `${invoicesThisMonth} created this month`,
        },
      },

      invoices: invoiceSummaries,
      hasOverdue: overdueCount > 0,
      overdueCount,
      unpaidCount,
    };

    return { success: true, client: details };
  } catch (error) {
    console.error("[getClient]", error);
    return { success: false, error: "Internal server error", status: 500 };
  }
}

// ── action ─────────────────────────────────────────────────
export async function getClientDashboardStats(): Promise<GetClientStatsResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!business) {
      return { success: false, error: "No business found" };
    }

    const now = new Date();
    const thisMonthStart = startOf(now);
    const lastMonthStart = startOf(
      new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );

    // Run all queries in parallel
    const [
      totalClients,
      clientsThisMonth,
      clientsLastMonth,
      allPayments,
      paymentsThisMonth,
      paymentsLastMonth,
      unpaidInvoices,
      paidInvoicesThisMonth,
      paidInvoicesLastMonth,
    ] = await Promise.all([
      // ── 1. Total client count ──────────────────────────────
      prisma.client.count({
        where: { businessId: business.id },
      }),

      // ── 2. Clients added this month ───────────────────────
      prisma.client.count({
        where: {
          businessId: business.id,
          createdAt: { gte: thisMonthStart },
        },
      }),

      // ── 3. Clients added last month ───────────────────────
      prisma.client.count({
        where: {
          businessId: business.id,
          createdAt: { gte: lastMonthStart, lt: thisMonthStart },
        },
      }),

      // ── 4. All payments ever (lifetime billed) ────────────
      prisma.payment.findMany({
        where: {
          invoice: { businessId: business.id },
        },
        select: { amount: true },
      }),

      // ── 5. Payments received this month ───────────────────
      prisma.payment.aggregate({
        where: {
          invoice: { businessId: business.id },
          paidAt: { gte: thisMonthStart },
        },
        _sum: { amount: true },
      }),

      // ── 6. Payments received last month ───────────────────
      prisma.payment.aggregate({
        where: {
          invoice: { businessId: business.id },
          paidAt: { gte: lastMonthStart, lt: thisMonthStart },
        },
        _sum: { amount: true },
      }),

      // ── 7. Unpaid invoices (DUE + OVERDUE) ────────────────
      prisma.invoice.findMany({
        where: {
          businessId: business.id,
          status: { in: [InvoiceStatus.DUE, InvoiceStatus.OVERDUE] },
        },
        include: {
          items: { select: { units: true, price: true } },
        },
      }),

      // ── 8. Paid invoices this month (for avg pay time) ────
      prisma.invoice.findMany({
        where: {
          businessId: business.id,
          status: InvoiceStatus.PAID,
          paidDate: { gte: thisMonthStart },
        },
        select: { issueDate: true, paidDate: true },
      }),

      // ── 9. Paid invoices last month (for avg pay time) ────
      prisma.invoice.findMany({
        where: {
          businessId: business.id,
          status: InvoiceStatus.PAID,
          paidDate: { gte: lastMonthStart, lt: thisMonthStart },
        },
        select: { issueDate: true, paidDate: true },
      }),
    ]);

    // ── Derive: total billed ───────────────────────────────
    const totalBilled = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const billedThisMonth = paymentsThisMonth._sum.amount ?? 0;
    const billedLastMonth = paymentsLastMonth._sum.amount ?? 0;
    const billedPct = pctChange(billedThisMonth, billedLastMonth);

    // ── Derive: outstanding ────────────────────────────────
    const outstandingAmount = unpaidInvoices.reduce((total, invoice) => {
      return (
        total +
        invoice.items.reduce((sum, item) => sum + item.units * item.price, 0)
      );
    }, 0);

    const overdueCount = unpaidInvoices.filter(
      (invoice) => invoice.dueDate < now
    ).length;

    const unpaidCount = unpaidInvoices.length;

    // ── Derive: avg pay time ───────────────────────────────
    function avgDays(
      invoices: { issueDate: Date; paidDate: Date | null }[]
    ): number | null {
      const valid = invoices.filter((inv) => inv.paidDate !== null);
      if (!valid.length) return null;
      const total = valid.reduce((sum, inv) => {
        return (
          sum +
          (inv.paidDate!.getTime() - inv.issueDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }, 0);
      return Math.round(total / valid.length);
    }

    const avgThisMonth = avgDays(paidInvoicesThisMonth);
    const avgLastMonth = avgDays(paidInvoicesLastMonth);

    // Lower avg pay time = better (client is paying faster)
    function payTimeTrend(
      current: number | null,
      previous: number | null
    ): TrendDirection {
      if (current === null || previous === null) return "neutral";
      if (current < previous) return "up"; // faster = good
      if (current > previous) return "down"; // slower = bad
      return "neutral";
    }

    function payTimeLabel(
      current: number | null,
      previous: number | null
    ): string {
      if (current === null) return "No data yet";
      if (previous === null) return `${current}d this month`;
      const diff = Math.abs(current - previous);
      if (diff === 0) return "Same as last month";
      const direction = current < previous ? "Faster" : "Slower";
      return `${direction} by ${diff}d vs last month`;
    }

    // ── Build stat subtitles ───────────────────────────────
    const stats: ClientDashboardStats = {
      totalClients: {
        count: totalClients,
        subtitle: {
          trend: clientsThisMonth > 0 ? "up" : "neutral",
          label:
            clientsThisMonth === 0
              ? "None added this month"
              : `${clientsThisMonth} added this month`,
        },
      },

      totalBilled: {
        amount: totalBilled,
        subtitle: {
          trend: billedPct > 0 ? "up" : billedPct < 0 ? "down" : "neutral",
          label:
            billedLastMonth === 0
              ? "Across all clients"
              : `${billedPct > 0 ? "+" : ""}${billedPct}% vs last month`,
        },
      },

      outstanding: {
        amount: outstandingAmount,
        subtitle: {
          // More overdue = worse
          trend: overdueCount > 0 ? "down" : unpaidCount > 0 ? "neutral" : "up",
          label:
            unpaidCount === 0
              ? "All invoices settled"
              : overdueCount > 0
                ? `${overdueCount} overdue · ${unpaidCount} total unpaid`
                : `${unpaidCount} invoice${unpaidCount !== 1 ? "s" : ""} unpaid`,
        },
      },

      avgPayTime: {
        days: avgThisMonth,
        subtitle: {
          trend: payTimeTrend(avgThisMonth, avgLastMonth),
          label: payTimeLabel(avgThisMonth, avgLastMonth),
        },
      },
    };

    return { success: true, stats };
  } catch (error) {
    console.error("[getClientDashboardStats]", error);
    return { success: false, error: "Failed to load stats" };
  }
}

// ── Action ─────────────────────────────────────────────────────────────────

export async function updateClient(
  clientId: string,
  input: z.infer<typeof clientDetailsSchema>
): Promise<UpdateClientResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }

    // ── Validate input ─────────────────────────────────────────────────────
    const parsed = clientDetailsSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error
      return {
        success: false,
        error: firstError?.message ?? "Invalid input",
        status: 422,
      };
    }

    const data = parsed.data;

    // ── Verify the client exists and belongs to this user ──────────────────
    // Single query — fetch the client with its business owner in one round
    // trip rather than two separate lookups.
    const existing = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        businessId: true,
        phone: true,
        business: {
          select: { ownerId: true },
        },
      },
    });

    if (!existing) {
      return { success: false, error: "Client not found", status: 404 };
    }

    if (existing.business.ownerId !== session.user.id) {
      return { success: false, error: "Forbidden", status: 403 };
    }

    // ── Phone uniqueness check ─────────────────────────────────────────────
    // The Client model has @@unique([businessId, phone]).
    // If the user is changing the phone number, verify it is not already
    // taken by another client in the same business.
    const incomingPhone = data.phone || null;
    const phoneChanged = incomingPhone !== existing.phone;

    if (phoneChanged && incomingPhone) {
      const conflict = await prisma.client.findUnique({
        where: {
          businessId_phone: {
            businessId: existing.businessId,
            phone: incomingPhone,
          },
        },
        select: { id: true },
      });

      if (conflict && conflict.id !== clientId) {
        return {
          success: false,
          error: "A client with this phone number already exists",
          status: 422,
        };
      }
    }

    // ── Persist ────────────────────────────────────────────────────────────
    // Empty strings are normalised to null so the DB stays clean.
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: data.name,
        email: data.email || null,
        phone: incomingPhone,
        address: data.address || null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return { success: true, client: updated };
  } catch (error) {
    console.error("[updateClient]", error);
    return { success: false, error: "Internal server error", status: 500 };
  }
}