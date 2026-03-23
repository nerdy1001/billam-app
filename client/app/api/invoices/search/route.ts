import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/app/utils/server-session.util";
import { InvoiceStatus } from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q");
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 12;

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: {
            business: {
                ownerId: session.user.id,
            },

            // 🔎 Search condition
            AND: [
                {
                    OR: [
                        {
                            clientName: {
                                contains: query!,
                                mode: "insensitive",
                            },
                        },
                        {
                            projectName: {
                                contains: query!,
                                mode: "insensitive",
                            },
                        },
                    ],
                    
                },
                // 📌 Status filter (only if not "all")
                status !== "all-invoices"
                ?   {
                        status: status!.toUpperCase() as InvoiceStatus, // e.g. PAID, DUE
                    }
                : {},
            ], 
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
            items: true,
        }
    }),
    prisma.invoice.count({
        where: {
            business: {
                ownerId: session.user.id,
            },

            // 🔎 Search condition
                AND: [
                    {
                        OR: [
                            {
                            clientName: {
                                contains: query!,
                                mode: "insensitive",
                            },
                            },
                            {
                            projectName: {
                                contains: query!,
                                mode: "insensitive",
                            },
                            },
                        ],
                    },
                ],
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      invoices,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Invoices API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}