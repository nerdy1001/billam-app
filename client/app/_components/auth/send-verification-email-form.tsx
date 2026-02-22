"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendVerificationEmail } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileText, Loader2, Mail } from 'lucide-react';
import { Manrope } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z, { email } from 'zod';


interface verificationFormProps {
    error: string
}

const logoFont = Manrope({ subsets: ['latin'], weight: '700' });

const verificationFormSchema = z.object({
    email: z.email({ message: 'Invalid Email Address' })
})

export type verificationFormValue = z.infer<typeof verificationFormSchema>;


const SendVerificationEmailForm = ({ error }: verificationFormProps) => {

    const router = useRouter();

    const [isPending, setIsPending] = useState(false);


    const form = useForm<verificationFormValue>({
        resolver: zodResolver(verificationFormSchema),
        defaultValues: {
            email: ""
        },
    });

    const { mutate: verifyEmail, isPending: isProcessing } = useMutation({
        mutationFn: async ( data: verificationFormValue ) => {
            await sendVerificationEmail({
                email: data.email,
                callbackURL: "/onboarding",
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
                        toast.success("Verification email sent successfully.");
                        router.push("/auth/verify/success");
                    },
                },
            });
        }
    })

  const onSubmitVerificationForm = async (data: verificationFormValue) => {
    verifyEmail(data)
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
            <div className='flex flex-col space-y-2 justify-center max-w-md mx-auto w-full'>
                <div className='bg-red-50 p-4 rounded-md'>
                    <h1 className='text-destructive'>
                        <span className="capitalize">
                            {error.replace(/_/g, " ").replace(/-/g, " ")}
                        </span>{" "}
                        - Please request a new verification email.
                    </h1>
                </div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmitVerificationForm)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-normal">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="email" {...field} className="h-12 border-border bg-card pl-10 pr-10" placeholder="email@example.com" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" variant="signup" disabled={isProcessing} className="w-full h-12 mt-2 py-3 bg-[#1E3A8A] hover:bg-[#081a4c] text-white cursor-pointer">
                            {isProcessing ? (
                                <Loader2 className='size-8 animate-spin text-white' />
                            ) : 'Resend Verification Email'}
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

export default SendVerificationEmailForm