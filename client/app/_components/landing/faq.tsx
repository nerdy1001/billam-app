'use client';

import React, { useState } from "react";

import { faqs } from "@/app/utils/data.util";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqItemProps {
    faq: {
        id: string;
        question: string;
        answer: string;
    };
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <Button variant={'ghost'} onClick={onClick} className="w-full flex items-center justify-between p-8 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <span>
                    {faq.question}
                </span>
                <ChevronDown className={cn('w-6 h-6 text-gray-400 transition-transform duration-300', isOpen ? 'transform rotate-100': '')} />
            </Button>
            {isOpen && (
                <div className="px-6 pt-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                </div>
            )}
        </div>
    )
}

const Faq = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white rounded-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Here are a few faqs to help you get started with ease
                </p>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FaqItem
                        key={index}
                        faq={faq}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    </section>
  )
}

export default Faq