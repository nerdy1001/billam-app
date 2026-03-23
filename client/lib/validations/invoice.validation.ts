import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  units: z.coerce.number<number>().min(1),
  price: z.coerce.number<number>().min(0),
});

export const paymentTermSchema = z.object({
  term: z.string().min(1, "At least one payment term is required")
})

export const invoiceSchema = z.object({

    // name: z.string().min(2, { message: 'Your must be at least three(3) characters long'}),
    // email: z.email({ message: 'Invalid email address' }).nonempty('Email is required'),
    // phoneNumber: z.string().min(9, { message: 'Phone number must be at least nine(09) characters long'}),
    // logo: z.union([z.instanceof(File), z.string()]).optional(),

    clientName: z.string().min(2, { message: 'Client name must be at least three(3) characters long'}),
    clientEmail:  z.email({ message: 'Invalid email address' }).nonempty('Email is required').optional(),
    clientPhone: z.string().min(9, { message: 'Phone number must be at least nine(09) characters long'}),
    clientAddress: z.string().min(1),

    projectName: z.string().min(1),
    issueDate: z.date(),
    dueDate: z.date(),

    items: z.array(invoiceItemSchema).min(1),
    paymentTerms: z.array(paymentTermSchema).min(1),

    // paymentMethods: z
    // .array(z.enum(["mobile_money", "orange_money", "credit_card"]))
    // .min(1, "Select at least one payment method"),


    // mobileMoneyNumber: z.string().optional(),
    // orangeMoneyNumber: z.string().optional(),
    // cardNumber: z.string().optional(),

    notes: z.string().optional(),
})
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
