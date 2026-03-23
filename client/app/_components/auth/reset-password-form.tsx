"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileText, Loader2, Lock } from 'lucide-react';
import { Manrope } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface ResetPasswordFormProps {
    token: string;
}

const logoFont = Manrope({ subsets: ['latin'], weight: '700' });

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password must be less than 100 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords don't match",
  path: ["confirmPassword"],
});

export type resetPasswordFormValue = z.infer<typeof resetPasswordSchema>;


const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {

    const [isPending, setIsPending] = useState(false);

    const router = useRouter();


    const form = useForm<resetPasswordFormValue>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const { mutate: sendResetLink, isPending: isProcessing } = useMutation({
        mutationFn: async ( data: resetPasswordFormValue ) => {
            await resetPassword({
                newPassword: data.password,
                token,
                fetchOptions: {
                    onRequest: () => {
                        setIsPending(true);
                    },
                    onResponse: () => {
                        setIsPending(false);
                    },
                    onError: (ctx: any) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: () => {
                        toast.success("Password reset successfully.");
                        router.push("/auth/login");
                    },
                },
            });
        }
    })

  const onSubmitVerificationForm = async (data: resetPasswordFormValue) => {
    sendResetLink(data)
  }

  return (
    <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col px-8 md:px-16 lg:px-8 xl:px-20">
            {/* Logo */}
            <div className="my-12 flex items-center justify-center mx-auto">
                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-[#1E3A8A] rounded-sm flex items-center justify-center'> 
                        <FileText className='w-4 h-4 text-white' />
                    </div>
                    <span className={`text-4xl font-bold text-gray-900 ${logoFont.className}`}>
                        Billam
                    </span>
                </div>
            </div>
            {/* Form Container */}
            <div className='flex flex-col space-y-4 justify-center max-w-md mx-auto my-auto w-full'>
                <div className='flex flex-col space-y-2'>
                    <h1 className='text-xl font-bold text-gray-700'>
                        Reset Password
                    </h1>
                    <p className='font-normal text-muted-foreground'>
                        Please enter your new password. Make sure it is at least 8 characters.
                    </p>
                </div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmitVerificationForm)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-normal">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="password" {...field} className="h-12 border-border bg-card pl-10 pr-10" placeholder="Create a password" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-normal">
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="password" {...field} className="h-12 border-border bg-card pl-10 pr-10" placeholder="Confirm your password" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" variant="signup" disabled={isProcessing} className="w-full h-12 mt-2 py-3 bg-[#1E3A8A] hover:bg-[#081a4c] text-white cursor-pointer">
                            {isProcessing ? (
                                <Loader2 className='size-8 animate-spin text-white' />
                            ) : 'Reset password'}
                        </Button>
                    </form>
                </Form>
                {/* Footer */}
                <div className="mt-auto pt-8">
                    <p className="text-sm text-muted-foreground"> &copy; {new Date().getFullYear()} Billam.</p>
                </div>
            </div>
        </div>
        {/* Right Side - Image Placeholder */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-signup-image items-center justify-center">
            <div className="w-full h-full bg-signup-placeholder rounded-xl flex items-center justify-center relative">
                <Image src="/signup-img.jpg" fill alt="Sign Up Illustration" className="object-cover"/>
            </div>
        </div>
    </div>
  )
}

export default ResetPasswordForm