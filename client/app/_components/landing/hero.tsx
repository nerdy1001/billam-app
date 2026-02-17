'use client';

import Image from "next/image";
import Link from "next/link"

const Hero = () => {

    const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.5] bg-size-[60px_60px]">
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">
                    Create professional invoices. Get paid faster.
                </h1>
                <p className="leading-7 not-first:mt-6 text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                    Billam helps freelancers and small businesses create invoices from simple text, send smart payment reminders, and understand their cash flow — all with the power of AI.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {isAuthenticated ? (
                        <Link href={`/dashboard/xyz`} className="bg-linear-to-r from-[#1E3A8A] to-blue-900 text-white px-8 py-3 rounded-md font-bold text-base sm:text-lg hover:bg-blue-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">
                            Go to dashboard
                        </Link>
                    ): (
                        <Link href="/auth/signup" className="bg-linear-to-r from-[#1E3A8A] to-blue-900 text-white px-8 py-3 rounded-md font-bold text-base sm:text-lg hover:bg-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">
                            Get Started
                        </Link>
                    )}
                    <a href="#features" className="border-2 border-black text-black px-8 py-3 rounded-md font-bold text-base sm:text-lg hover:text-black transition-all duration-200 hover:scale-105">
                        Learn More
                    </a>
                </div>
            </div>
            <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
                <Image src={'/billam-dashboard.png'} width={1024} height={1024} alt="billam-dashboard-screenshot" className="rounded-2xl shadow-2xl shadow-gray-300 border-4 border-gray-200/20" />
            </div>
        </div>
    </section>
  )
}

export default Hero