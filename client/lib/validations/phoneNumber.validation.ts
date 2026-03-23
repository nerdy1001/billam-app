import z from "zod";

export const phoneNumberSchema = z.object({
    phoneNumber: z.string().min(9, "Phone number must be at least 9 digits").max(15, "Phone number must be at most 15 digits"),
})

export type phoneNumberFormValue = z.infer<typeof phoneNumberSchema>