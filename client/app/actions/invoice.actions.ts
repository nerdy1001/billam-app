"use server";

import { prisma } from "@/lib/prisma";

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

export async function createInvoiceAction(data: CreateInvoiceInput) {
  try {

    if (!data.items || data.items.length === 0) {
      throw new Error("Invoice must contain at least one item");
    } 

    const customer = await prisma.customer.upsert({
      where: {
        businessId_email: {
          businessId: data.businessId,
          email: data.clientEmail,
        },
      },
      update: {
        name: data.clientName,
        phone: data.clientPhone,
      },
      create: {
        businessId: data.businessId,
        name: data.clientName,
        email: data.clientEmail,
        phone: data.clientPhone,
      },
    });


    /**
     * 1️⃣ Compute totals
     */
    const itemsWithTotals = data.items.map((item) => {
      if (item.quantity <= 0 || item.unitPrice < 0) {
        throw new Error("Invalid invoice item");
      }

      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      };
    });

    const subtotal = itemsWithTotals.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const tax = data.tax ?? 0;
    const total = subtotal + tax;

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
            businessId: data.businessId,
            year,
          },
        },
        update: {},
        create: {
          businessId: data.businessId,
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
            businessId: data.businessId,
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
          businessId: data.businessId,
          userId: data.userId,
          customerId: customer.id,

          invoiceNo,
          status: 'DRAFT',

          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,

          issueDate: data.issueDate,
          dueDate: data.dueDate,

          subtotal,
          tax,
          total,
          notes: data.notes,

          items: {
            create: itemsWithTotals,
          },
        },
        include: { items: true },
      });
    });

    return { success: true, invoice };
  } catch (error: any) {
    console.error("[CREATE_INVOICE_ERROR]", error);
    return { success: false, error: error.message };
  }
}
