import z from "zod";

export const passwordSchema = z.object({
    old_password: z.string().min(8, {message: 'Password must contain at least eight(8) characters'}),
    new_password: z.string().min(8, {message: 'Password must contain at least eight(8) characters'}),
    confirm_new_password: z.string().min(8, {message: 'Password must contain at least eight(8) characters'}) 
}).superRefine(({ new_password, confirm_new_password }, ctx) => {
    if (new_password !== confirm_new_password) {
        ctx.addIssue({
            code: 'custom',
            message: 'The passwords do not match.',
            path: ['confirm_new_password']
        })
    }
});

export type passwordFormValues = z.infer<typeof passwordSchema>