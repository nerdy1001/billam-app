"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invoiceSchema } from "@/lib/validations/invoice.validation";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getServerSession } from "../utils/server-session.util";
import { getCurrentBusiness } from "../utils/get-current-business.util";

type InvoiceItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type CreateInvoiceInput = {
  businessId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  userId: string;
  issueDate: Date;
  dueDate: Date;
  tax?: number;
  notes?: string;
  items: InvoiceItemInput[];
};

type UpdateInvoiceInput = {
  invoiceId: string;

  customer?: {
    name: string;
    email?: string;
    phone?: string;
  };

  issueDate?: Date;
  dueDate?: Date;
  tax?: number;
  notes?: string;

  items?: {
    description: string;
    units: number;
    priice: number;
  }[];
};

type DeleteInvoiceInput = {
  invoiceId: string;
};


export async function createInvoiceAction(data: z.infer<typeof invoiceSchema>) {

    const session = await getServerSession();

    if (!session) {
        return { success: false, message: "Unauthorized Access"}
    }

  try {

    if (!data.items || data.items.length === 0) {
      return { error: 'Invoice must contain at least one item' };
    };

    const existingBusiness = await getCurrentBusiness();

    if (!existingBusiness) {
        return {
          error: true,
          message: "Business does not exist for this user."
        }
    }

    

    const client = await prisma.client.upsert({
      where: {
        businessId_phone: {
          businessId: existingBusiness.id,
          phone: data.clientPhone,
        },
      },
      update: {
        name: data.clientName,
        phone: data.clientPhone,
      },
      create: {
        businessId: existingBusiness.id,
        name: data.clientName,
        email: data.clientEmail,
        phone: data.clientPhone,
        address: data.clientAddress
      },
    });

    const year = data.issueDate.getFullYear();

    /**
     * 2️⃣ Atomic transaction
     */
    const invoice = await prisma.$transaction(async (tx) => {
      /**
       * 2a️⃣ Ensure year counter exists
       */
      await tx.businessInvoiceYearCounter.upsert({
        where: {
          businessId_year: {
            businessId: existingBusiness.id,
            year,
          },
        },
        update: {},
        create: {
          businessId: existingBusiness.id,
          year,
          nextNumber: 1,
        },
      });

      /**
       * 2b️⃣ Atomically increment counter
       */
      const counter = await tx.businessInvoiceYearCounter.update({
        where: {
          businessId_year: {
            businessId: existingBusiness.id,
            year,
          },
        },
        data: {
          nextNumber: { increment: 1 },
        },
      });

      const sequence = counter.nextNumber - 1;
      const paddedSequence = String(sequence).padStart(4, "0");

      const invoiceNo = `INV-${year}-${paddedSequence}`;

      /**
       * 2c️⃣ Create invoice
       */
      return tx.invoice.create({
        data: {
          businessId: existingBusiness.id,
          userId: session.user.id,
          clientId: client.id,

          invoiceNo,
          status: 'DUE',

          projectName: data.projectName,
          paymentTerms: {
            create: data.paymentTerms
          },

          clientName: client.name,
          clientEmail: client.email,
          clientPhone: client.phone,
          clientAddress: client.address,

          issueDate: data.issueDate,
          dueDate: data.dueDate,

          notes: data.notes,

          items: {
            create: data.items,
          },
        },
        include: { items: true },
      });
    });

    return { success: true, message: "Your invoice has been created successfully." };
  } catch (error: any) {
    console.error("[CREATE_INVOICE_ERROR]", error);
    return { success: false, error: error.message };
  }
}

export async function getBusinessInvoices(businessId: string) {
  if (!businessId) {
    return { error: 'BusinessId is required'};
  };

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId,
    },
    include: {
      client: true,
      items: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

export async function getInvoice(invoiceId: string) {

    const invoices = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        include: {
            items: true,
            paymentTerms: true
        }
    });

  return invoices;
}

export async function getBusinessInvoicesByStatus(
  businessId: string,
  status: "DRAFT" | "DUE" | "PAID" | "OVERDUE" | "CANCELLED"
) {
  return prisma.invoice.findMany({
    where: {
      businessId,
      status,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOverdueInvoices() {
  try {
    // Resolve business context
    const business = await getCurrentBusiness();

    if (!business || !business.id) {
      return { success: false, error: "Business not found" };
    }

    const now = new Date();

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId: business.id,
        OR: [
          { status: "OVERDUE" },
          // Also treat invoices that are marked as DUE but whose dueDate has passed as overdue
          { status: "DUE", dueDate: { lt: now } },
        ],
      },
      include: {
        client: true,
        items: true,
        payments: true,
        paymentTerms: true,
      },
      orderBy: { dueDate: "asc" },
      take: 3,
    });

    return { success: true, invoices };
  } catch (error: any) {
    console.error("[GET_FIRST_THREE_OVERDUE_INVOICES_ERROR]", { error });
    return {
      success: false,
      error: error?.message ?? "Failed to fetch overdue invoices",
    };
  }
}

export async function getFirstThreeRecentInvoices() {
  try {
    const business = await getCurrentBusiness();

    if (!business || !business.id) {
      return { success: false, error: "Business not found" };
    }

    const invoices = await prisma.invoice.findMany({
      where: { businessId: business.id },
      include: {
        client: true,
        items: true,
        payments: true,
        paymentTerms: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return { success: true, invoices };
  } catch (error: any) {
    console.error("[GET_FIRST_THREE_RECENT_INVOICES_ERROR]", { error });
    return { success: false, error: error?.message ?? "Failed to fetch recent invoices" };
  }
}

export async function updateInvoiceAction(input: z.infer<typeof invoiceSchema>, invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true },
  });

  if (!invoice) {
    return { error: "Invoice not found" };
  }

  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return { error: "Only draft invoices can be edited" };
  }

  // 📦 Decide which items to use
  const itemsToUse = input.items ?? invoice.items;

  if (!itemsToUse.length) {
    return { error: "Invoice must have at least one item" };
  }

  await prisma.$transaction(async (tx) => {

    await tx.invoiceItem.deleteMany({
      where: { invoiceId: invoice.id },
    });

    if (input.paymentTerms) {
      await tx.paymentTerm.deleteMany({
        where: { invoiceId: invoice.id }
      })
    }

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        issueDate: input.issueDate ?? invoice.issueDate,
        dueDate: input.dueDate ?? invoice.dueDate,
        notes: input.notes ?? invoice.notes,
        clientName: input.clientName ?? invoice.clientName,
        clientEmail: input.clientEmail ?? invoice.clientEmail,
        clientAddress: input.clientAddress ?? invoice.clientAddress,
        clientPhone: input.clientPhone ?? invoice.clientPhone,
        projectName: input.projectName,
        items: {
          create: input.items
        },
        paymentTerms: {
          create: input.paymentTerms
        }
      },
    });
  });

  return { success: true, message: "Invoice updated" };
}

export async function deleteInvoice(input: DeleteInvoiceInput) {
  try {
    if (!input.invoiceId) {
      return {
        success: false,
        error: 'Missing invoiceId',
      };
    }

    // 1️⃣ Check invoice existence & ownership
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: input.invoiceId,
      },
      select: { id: true },
    });

    if (!invoice) {
      return {
        success: false,
        error: 'Invoice not found or access denied',
      };
    }

    // 2️⃣ Delete invoice
    await prisma.invoice.delete({
      where: {
        id: input.invoiceId,
      },
    });

    // 3️⃣ Revalidate affected pages
    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${input.invoiceId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('[DELETE_INVOICE_ERROR]', error);

    return {
      success: false,
      error: 'Failed to delete invoice',
    };
  }
}

