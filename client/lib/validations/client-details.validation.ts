import { z } from "zod";


/* ---------------- SCHEMA ---------------- */

export const clientDetailsSchema = z.object({
  /* --- Business Info --- */
  name: z.string().min(2),
  email: z.email().optional(),
  phone: z.string().min(9),
  address: z.string().min(9).optional(),
})

export type ClientDetailsFormValues = z.infer<typeof clientDetailsSchema>;