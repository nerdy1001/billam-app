'use client'

import { getCurrentBusiness } from '@/app/utils/get-current-business.util';
import { getBusinessPaymentMethods } from '@/app/utils/get-payment-methods.util';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Business, BusinessPaymentMethod } from '@/generated/prisma';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface InvoiceItem {
  description: string;
  units: number;
  price: number;
}

interface PaymentTerm {
    term: string;
}

interface InvoicePreviewProps {
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhoneNumber?: string;
  projectName?: string;
  issueDate?: Date;
  dueDate?: Date;
  paymentTerms?: PaymentTerm[];
  items?: InvoiceItem[];
  notes?: string;
}



const InvoicePreview = ({
    clientName,
    clientEmail,
    clientAddress,
    clientPhoneNumber,
    projectName,
    issueDate,
    dueDate,
    paymentTerms,
    items,
    notes
}: InvoicePreviewProps) => {

    const [business, setBusiness] = useState<Business | null>();
    const [paymentMethods, setPaymentMethods] = useState<Array<BusinessPaymentMethod> | null>();

    useEffect(() => {
        const getBusiness = async () => {
            try {
                const data = await getCurrentBusiness();

                setBusiness(data)
            } catch (error) {
                console.log(error)
            }
        }

        const getPaymentMethods = async () => {
            try {
                const data = await getBusinessPaymentMethods();

                setPaymentMethods(data)
            } catch (error) {
                console.log(error)
            }
        }

        getBusiness();
        getPaymentMethods();
    }, [])

    return (
        <div className='flex flex-col space-y-12'>
            {/* Header area */}
            <div className='flex items-start justify-between w-full'>
                <div className='flex flex-col gap-1'>
                    <h1 className='md:text-4xl text-2xl font-semibold tracking-tighter'>
                        Invoice
                    </h1>
                    <p className='md:text-base text-sm text-gray-400 font-normal tracking-tighter'>
                        INV-2026-001
                    </p>
                    <h1 className='md:text-base text-sm text-gray-400 font-normal tracking-tighter'>
                        {format(issueDate!, "PPP")}
                    </h1>
                </div>
                <div className='flex items-center justify-end'>
                    {/* Only render if logo is a non-empty string */}
                    {business?.logo ? (
                        <div className="relative md:h-12 h-8 w-auto flex justify-end">
                            <Image 
                                src={business.logo} 
                                width={200} 
                                height={200} 
                                className='w-auto md:h-12 h-8' 
                                alt='business-logo' 
                            />
                        </div>
                        ) : (
                        // Placeholder to maintain layout balance if no logo exists
                        <div className="h-16 w-16 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center">
                            <span className="text-[10px] text-slate-400 font-medium">LOGO</span>
                        </div>
                    )}
                </div>
            </div>
            <Separator />
            {/* Billing details */}
            <div className='flex flex-col space-y-8'>
                <div className='flex md:flex-row flex-col md:gap-0 gap-2 flex-1 md:items-center justify-between'>
                    <div className='flex flex-col gap-0.5'>
                        <h1 className='md:text-2xl text-base font-semibold tracking-tighter'>
                            {projectName}
                        </h1>
                    </div>
                    <div className='flex items-center gap-2 bg-red-50 py-2 px-4 rounded-full w-fit'>
                        <p className='md:text-sm text-xs font-medium text-red-500 tracking-tighter'>
                            Due date:
                        </p>
                        <h1 className='md:text-sm text-xs text-red-500 font-semibold tracking-tighter'>
                            {format(dueDate!, "PPP")}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1 max-w-sm'>
                        <p className='md:text-sm text-xs font-medium text-gray-500 tracking-tighter'>
                            Billed to
                        </p>
                        {/* Client details */}
                        <div className='flex flex-col space-y-0.5'>
                            <p className='md:text-base text-xs font-semibold tracking-tighter'>
                                {clientName}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {clientPhoneNumber}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {clientEmail}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {clientAddress}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 max-w-md items-end'>
                        <p className='md:text-sm text-xs font-medium text-gray-500 tracking-tighter'>
                            Billed from
                        </p>
                        {/* Business details */}
                        <div className='flex flex-col space-y-0.5 items-end'>
                            <p className='md:text-base text-xs font-semibold tracking-tighter'>
                                {business?.name}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {business?.email}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {business?.phone1}
                            </p>
                            <p className='md:text-sm text-xs text-gray-400 font-normal tracking-tighter'>
                                {business?.phone2}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
            {/* Invoice items */}
            <div className='flex flex-col space-y-8'>
                <h1 className='md:text-lg text-sm font-bold tracking-tighter'>
                    Description of services
                </h1>
                <div className='flex flex-col'>
                    <div className='grid grid-cols-12 bg-gray-100 w-full'>
                        <div className="col-span-6 md:text-sm text-xs font-bold p-4">Description</div>
                        <div className="col-span-2 md:text-sm text-xs font-bold text-center p-4">Units</div>
                        <div className="col-span-2 md:text-sm text-xs font-bold text-right p-4">Price</div>
                        <div className="col-span-2 md:text-sm text-xs font-bold text-right p-4">Amount</div>
                    </div>
                    <div className="">
                        {items && items.length > 0 ? (
                            items.map((item, index) => {
                                const units = Number(item.units) || 0;
                                const price = Number(item.price) || 0;
                                const amount = units * price;

                                return (
                                <div key={index} className="grid grid-cols-12 items-center border-b">
                                    <div className="col-span-6 p-4">
                                        <p className=" md:text-sm text-xs font-medium tracking-tighter">{item.description || "Untitled Item"}</p>
                                    </div>
                                    <div className="col-span-2 text-center p-4">
                                        <p className=" md:text-sm text-xs font-medium tracking-tighter">{units}</p>
                                    </div>
                                    <div className="col-span-2 text-right p-4">
                                        <p className=" md:text-sm text-xs font-medium tracking-tighter">{price.toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2 text-right p-4">
                                        <p className=" md:text-sm text-xs font-semibold tracking-tighter">{amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                );
                            })
                            ) : (
                            <p className="text-sm text-slate-400 italic text-center py-4">No items added yet</p>
                        )}
                    </div>

                    {/* Summary Section */}
                    <div className="mt-8 pt-4 flex flex-col items-end">
                        <div className="w-full max-w-62.5 space-y-2">
                        <div className="flex justify-between items-center tracking-tighter">
                            <span className="text-sm text-slate-500">Subtotal</span>
                            <span className="text-sm font-medium text-slate-800">
                                {items?.reduce((acc, item) => acc + (Number(item.units) * Number(item.price)), 0).toLocaleString()} XAF
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 tracking-tighter">
                            <span className="text-base font-bold text-slate-900">Total</span>
                            <span className="text-lg font-bold text-blue-600">
                                {items?.reduce((acc, item) => acc + (Number(item.units) * Number(item.price)), 0).toLocaleString()} XAF
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
            {/* Additional notes */}
            {notes && (
                <div className='flex items-center gap-2 p-4 rounded-md bg-yellow-50'>
                    <Info className='text-yellow-700' />
                    <p className='text-sm font-medium text-yellow-700 tracking-tighter'>
                        {notes}
                    </p>
                </div>
            )}
            {/* Payment methods */}
            <div className='flex flex-col space-y-4'>
                <h1 className='md:text-lg text-sm font-bold tracking-tighter'>
                    Payment methods
                </h1>
                <div className='grid md:grid-cols-3 grid-cols-2 md:gap-4 gap-2'>
                    {paymentMethods ? (
                        <>
                            {paymentMethods.map((paymentMethod) => (
                                <div key={paymentMethod.id}>
                                    <div className='flex flex-col gap-2 p-6 bg-gray-100 rounded-md place-items-start'>
                                        { paymentMethod.method === 'mobile_money' && (
                                            <img src={"/mnos-mtn.png"} alt='momo-logo' className='w-auto h-10 object-cover' />
                                        )}
                                        { paymentMethod.method === 'orange_money' && (
                                            <img src={"/orangemoney.png"} alt='orange-money-logo' className='w-12 h-10 object-cover' />
                                        )}
                                        { paymentMethod.method === 'credit_card' && (
                                            <img src={"/credit-card.png"} alt='credit-card' className='w-auto h-10 object-cover' />
                                        )}
                                        <p className='md:text-base text-xs font-semibold tracking-tighter'>
                                            {paymentMethod.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ): (
                        <div className='p-6 bg-gray-200 rounded-md'>
                            <div className='flex flex-col space-y-4'>
                                <Skeleton className='h-12 w-12' />
                                <Skeleton className='w-50 h-4' />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Payment Terms */}
            <div className='flex flex-col space-y-4 mb-50'>
                <h1 className='md:text-lg text-sm font-bold tracking-tighter'>
                    Payment terms
                </h1>
                <ol className='flex flex-col space-y-2'>
                    {paymentTerms?.map((term, index) => (
                        <div key={index}>
                            <li className='md:text-base text-xs font-medium tracking-tighter'>
                                • {term.term}
                            </li>
                        </div>
                    ))}
                </ol>
            </div>
        </div>
    )
}

export default InvoicePreview