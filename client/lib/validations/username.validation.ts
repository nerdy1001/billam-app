import z from "zod";

export const usernameSchema = z.object({
    username: z.string().min(2, { message: 'Username must be at least two characters long'}).max(50, { message: 'Username must be at most 50 characters long'})

})

export type usernameFormValue = z.infer<typeof usernameSchema>