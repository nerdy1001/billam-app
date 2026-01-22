'use client';

import { Quote } from "lucide-react"
import { billamTestimonials } from "@/app/utils/data.util"
import Image from "next/image"

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-4">Trusted by freelancers and small businesses</h2>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">See how Billam helps business owners create professional invoices, follow up on payments, and stay in control of their cash flow without stress or complexity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {billamTestimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 relative">
                        <div className="absolute -top-4 left-8 w-8 h-8 bg-linear-to-r from-[#1E3A8A] to-blue-900 rounded-full flex items-center justify-center text-white">
                            <Quote className="w-5 h-5" />
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed italic text-lg">
                            "{testimonial.quote}"
                        </p>
                        <div className="flex items-center space-x-4">
                            <Image unoptimized src={testimonial.image} alt={testimonial.name} width={50} height={50} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {testimonial.name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {testimonial.title}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Testimonials