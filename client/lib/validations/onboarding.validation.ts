import { z } from "zod";

/* ---------------- ENUMS ---------------- */

export const businessTypeEnum = z.enum([
  "tech_startup",
  "software_agency",
  "design_agency",
  "freelancer",
  "solopreneur",
  "ecommerce_business",
  "creative_agency",
  "consulting_firm",
]);

export const industryEnum = z.enum([
  "technology",
  "design",
  "marketing",
  "finance",
  "education",
  "healthcare",
  "ecommerce",
  "consulting",
  "photography",
  "other",
]);

export const paymentMethodEnum = z.enum([
  "mobile_money",
  "orange_money",
  "credit_card",
]);

export const businessPaymentMethodSchema = z.object({
  method: paymentMethodEnum,
  value: z.string().min(3, "Payment value is required"),
  label: z.string().optional(),
})

/* ---------------- SCHEMA ---------------- */

export const onboardingSchema = z.object({
  /* --- Business Classification --- */
  businessType: businessTypeEnum,
  industry: industryEnum,

  /* --- Business Info --- */
  businessName: z.string().min(2),
  businessEmail: z.string().email(),
  phoneNumber1: z.string().min(9),
  phoneNumber2: z.string().min(9).optional(),
  businessAddress: z.string().optional(),
  logo: z.string().optional(),

    /* --- Payment Setup --- */
  paymentMethods: z
    .array(businessPaymentMethodSchema)
    .min(1, "Add at least one payment method"),

  mobileMoneyNumber: z.string().optional(),
  orangeMoneyNumber: z.string().optional(),
  cardNumber: z.string().optional(),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type PaymentMethodType = z.infer<typeof paymentMethodEnum>;

