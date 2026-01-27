'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FileText, ImageIcon } from "lucide-react";
import { Manrope } from "next/font/google";
import Image from "next/image";

const logoFont = Manrope({ subsets: ['latin'], weight: '700' });

const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Form submitted:", data);
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col px-4 md:px-16 lg:px-8 xl:px-20">
        {/* Logo */}
        <div className="my-16 flex items-center justify-center mx-auto">
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
        <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <h1 className="text-xl font-bold mb-16 text-center text-gray-700">
                Create an account
            </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Button variant="google" className="w-full h-12 text-gray-700 cursor-pointer">
                <div className="h-5 w-5 mr-2">
                    <Image src="/google-icon.png" width={20} height={20} alt="Google Icon" />
                </div>
                Continue with Google
            </Button>
            
          <Separator className="my-8" />

          
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="h-12" />
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
                      <Input type="password" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="signup" className="w-full h-12 mt-2 py-3 bg-[#1E3A8A] hover:bg-[#081a4c] text-white cursor-pointer">
                Sign up
              </Button>
            </form>
          </Form>

          <p className="text-center mt-6 text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="underline font-bold cursor-pointer text-[#1E3A8A] hover:text-[#081a4c] transition-colors">
              Log In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8">
          <p className="text-sm text-muted-foreground">© 2026 Billam</p>
        </div>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-signup-image items-center justify-center">
        <div className="w-full h-full bg-signup-placeholder rounded-xl flex items-center justify-center relative">
          <Image src="/signup-img.jpg" fill alt="Sign Up Illustration" className="object-cover"/>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
