import z from "zod";
import { businessPaymentMethodSchema } from "./onboarding.validation";

export const paymentMethodSchema = z.object({
    /* --- Payment Setup --- */
  paymentMethods: z
    .array(businessPaymentMethodSchema)
    .min(1, "Add at least one payment method"),

  mobileMoneyNumber: z.string().optional(),
  orangeMoneyNumber: z.string().optional(),
  cardNumber: z.string().optional(),
})

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
