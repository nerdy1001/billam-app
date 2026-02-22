// "use server";

// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { invoiceSchema } from "@/lib/validations/invoice.validation";
// import { revalidatePath } from "next/cache";
// import z from "zod";

// type InvoiceItemInput = {
//   description: string;
//   quantity: number;
//   unitPrice: number;
// };

// type CreateInvoiceInput = {
//   businessId: string;
//   clientName: string;
//   clientEmail: string;
//   clientPhone: string;
//   clientAddress: string;
//   userId: string;
//   issueDate: Date;
//   dueDate: Date;
//   tax?: number;
//   notes?: string;
//   items: InvoiceItemInput[];
// };

// type UpdateInvoiceInput = {
//   invoiceId: string;

//   customer?: {
//     name: string;
//     email?: string;
//     phone?: string;
//   };

//   issueDate?: Date;
//   dueDate?: Date;
//   tax?: number;
//   notes?: string;

//   items?: {
//     description: string;
//     quantity: number;
//     unitPrice: number;
//   }[];
// };

// type DeleteInvoiceInput = {
//   invoiceId: string;
// };


// export async function createInvoiceAction(data: z.infer<typeof invoiceSchema>) {

//   const session = await auth.api.getSession();

//   if (!session) {
//     return { success: false, message: "Unauthorized Access"}
//   }

//   try {

//     if (!data.items || data.items.length === 0) {
//       return { error: 'Invoice must contain at least one item' };
//     };

//     const newBusiness = await prisma.business.create({
//       data: {
//         ownerId: session.user.id,
//         name: data.name,
//         email: data.email,
//         phone: data.phoneNumber,
//         logo: data.logo,
//         paymentMethods: data.paymentMethods,
//         cardNumber: data.cardNumber,
//       }
//     })

    

//     const client = await prisma.client.upsert({
//       where: {
//         businessId_phone: {
//           businessId: newBusiness.id,
//           phone: data.clientPhone,
//         },
//       },
//       update: {
//         name: data.clientName,
//         phone: data.clientPhone,
//       },
//       create: {
//         businessId: newBusiness.id,
//         name: data.clientName,
//         email: data.clientEmail,
//         phone: data.clientPhone,
//       },
//     });

//     const year = data.issueDate.getFullYear();

//     /**
//      * 2️⃣ Atomic transaction
//      */
//     const invoice = await prisma.$transaction(async (tx) => {
//       /**
//        * 2a️⃣ Ensure year counter exists
//        */
//       await tx.businessInvoiceYearCounter.upsert({
//         where: {
//           businessId_year: {
//             businessId: newBusiness.id,
//             year,
//           },
//         },
//         update: {},
//         create: {
//           businessId: newBusiness.id,
//           year,
//           nextNumber: 1,
//         },
//       });

//       /**
//        * 2b️⃣ Atomically increment counter
//        */
//       const counter = await tx.businessInvoiceYearCounter.update({
//         where: {
//           businessId_year: {
//             businessId: newBusiness.id,
//             year,
//           },
//         },
//         data: {
//           nextNumber: { increment: 1 },
//         },
//       });

//       const sequence = counter.nextNumber - 1;
//       const paddedSequence = String(sequence).padStart(4, "0");

//       const invoiceNo = `INV-${year}-${paddedSequence}`;

//       /**
//        * 2c️⃣ Create invoice
//        */
//       return tx.invoice.create({
//         data: {
//           businessId: newBusiness.id,
//           userId: session.user.id,
//           clientId: client.id,

//           invoiceNo,
//           status: 'DRAFT',

//           clientName: client.name,
//           clientEmail: client.email,
//           clientPhone: client.phone,
//           clientAddress: client.address,

//           issueDate: data.issueDate,
//           dueDate: data.dueDate,

//           total,
//           notes: data.notes,

//           items: {
//             create: data.items,
//           },
//         },
//         include: { items: true },
//       });
//     });

//     return { success: true, invoice };
//   } catch (error: any) {
//     console.error("[CREATE_INVOICE_ERROR]", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function getBusinessInvoices(businessId: string) {
//   if (!businessId) {
//     return { error: 'BusinessId is required'};
//   };

//   const invoices = await prisma.invoice.findMany({
//     where: {
//       businessId,
//     },
//     include: {
//       client: true,
//       items: true,
//       payments: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return invoices;
// }

// export async function getBusinessInvoicesByStatus(
//   businessId: string,
//   status: "DRAFT" | "SENT" | "PAID" | "OVERDUE"
// ) {
//   return prisma.invoice.findMany({
//     where: {
//       businessId,
//       status,
//     },
//     orderBy: { createdAt: "desc" },
//   });
// }

// export async function updateInvoiceAction(input: UpdateInvoiceInput) {
//   const invoice = await prisma.invoice.findUnique({
//     where: { id: input.invoiceId },
//     include: { items: true },
//   });

//   if (!invoice) {
//     return { error: "Invoice not found" };
//   }

//   if (invoice.status !== "DRAFT") {
//     return { error: "Only draft invoices can be edited" };
//   }

//   // 📦 Decide which items to use
//   const itemsToUse = input.items ?? invoice.items;

//   if (!itemsToUse.length) {
//     return { error: "Invoice must have at least one item" };
//   }

//   const subtotal = itemsToUse.reduce(
//     (sum, item) => sum + item.quantity * item.unitPrice,
//     0
//   );

//   const tax = input.tax ?? invoice.tax;
//   const total = subtotal + tax;

//   await prisma.$transaction(async (tx) => {
//     if (input.items) {
//       await tx.invoiceItem.deleteMany({
//         where: { invoiceId: invoice.id },
//       });

//       await tx.invoiceItem.createMany({
//         data: input.items.map((item) => ({
//           invoiceId: invoice.id,
//           description: item.description,
//           quantity: item.quantity,
//           unitPrice: item.unitPrice,
//           total: item.quantity * item.unitPrice,
//         })),
//       });
//     }

//     await tx.invoice.update({
//       where: { id: invoice.id },
//       data: {
//         issueDate: input.issueDate ?? invoice.issueDate,
//         dueDate: input.dueDate ?? invoice.dueDate,
//         notes: input.notes ?? invoice.notes,
//         tax,
//         subtotal,
//         total,

//         ...(input.customer && {
//           customerName: input.customer.name,
//           customerEmail: input.customer.email,
//           customerPhone: input.customer.phone,
//         }),
//       },
//     });
//   });

//   return { success: true };
// }

// export async function deleteInvoice(input: DeleteInvoiceInput) {
//   try {
//     if (!input.invoiceId) {
//       return {
//         success: false,
//         error: 'Missing invoiceId',
//       };
//     }

//     // 1️⃣ Check invoice existence & ownership
//     const invoice = await prisma.invoice.findFirst({
//       where: {
//         id: input.invoiceId,
//       },
//       select: { id: true },
//     });

//     if (!invoice) {
//       return {
//         success: false,
//         error: 'Invoice not found or access denied',
//       };
//     }

//     // 2️⃣ Delete invoice
//     await prisma.invoice.delete({
//       where: {
//         id: input.invoiceId,
//       },
//     });

//     // 3️⃣ Revalidate affected pages
//     revalidatePath('/dashboard/invoices');
//     revalidatePath(`/dashboard/invoices/${input.invoiceId}`);

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.error('[DELETE_INVOICE_ERROR]', error);

//     return {
//       success: false,
//       error: 'Failed to delete invoice',
//     };
//   }
// }

