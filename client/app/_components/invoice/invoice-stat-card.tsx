import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface InvoiceStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className: string;
}

const InvoiceStatCard = ({
  title,
  value,
  icon: Icon,
  className
}: InvoiceStatCardProps) => {
  return (
    <div className='border border-gray-200 cursor-pointer bg-white rounded-md hover:shadow-sm transition-all duration-200 hover:-translate-y-1'>
      <div className='flex flex-col space-y-2 p-4'>
        <div className={cn('p-2 rounded-sm w-fit', className)}>
          <Icon size={20} />
        </div>
        <p className='text-gray-400 text-sm font-medium'>
          {title}
        </p>
        <p className='md:text-2xl text-xl font-bold'>
          {value}
        </p>
      </div>
    </div>
  )
}

export default InvoiceStatCard