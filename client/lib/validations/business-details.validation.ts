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


/* ---------------- SCHEMA ---------------- */

export const businessDetailsSchema = z.object({
  /* --- Business Classification --- */
  businessType: businessTypeEnum,
  industry: industryEnum,

  /* --- Business Info --- */
  businessName: z.string().min(2),
  businessEmail: z.email().optional(),
  phoneNumber1: z.string().min(9),
  phoneNumber2: z.string().min(9).optional(),
  businessAddress: z.string().optional(),
  logo: z.string().optional(),

})

export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;