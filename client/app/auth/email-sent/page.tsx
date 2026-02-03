'use client';

import { CircleAlert, FileText } from "lucide-react";
import { Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";


const logoFont = Manrope({ subsets: ['latin'], weight: '700' });

export default function EmailSentPage() {
    return (
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col px-8 md:px-16 lg:px-8 xl:px-20">
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
          <div className="flex flex-col space-y-8 justify-center max-w-md mx-auto my-auto w-full">
            <div className="flex flex-col space-y-4">
              <p className="text-xl text-center font-normal text-gray-700">
                We sent you an email with a link to confirm it is you. Once you click on it, you will be redirected to your dashboard.
              </p>
              <div className="flex items-center gap-2 p-4 bg-red-100 rounded-md">
                <CircleAlert className="text-red-500" size={20} />
                <p className="text-red-500 text-md">
                  The link expires in 1 hour
                </p>
              </div>
            </div>
            <Link href="/login" className="underline font-bold cursor-pointer text-[#1E3A8A] hover:text-[#081a4c] transition-colors">
              I already confirmed the email on another device.
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-signup-image items-center justify-center">
            <div className="w-full h-full bg-signup-placeholder rounded-xl flex items-center justify-center relative">
                <Image src="/signup-img.jpg" fill alt="Sign Up Illustration" className="object-cover"/>
            </div>
        </div>
      </div>
    )
}