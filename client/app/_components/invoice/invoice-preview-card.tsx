'use client'

import { Badge } from '@/components/ui/badge'
import { Invoice, InvoiceItem } from '@/generated/prisma'
import { truncate } from '@/app/utils/trim-string.util'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Define a type that includes the items relation
type InvoiceWithItems = Invoice & {
  items?: InvoiceItem[];
};

interface InvoicePreviewCardProps {
  // Use the new type here instead of just 'Invoice'
  data: Partial<InvoiceWithItems>;
  businessLogo?: string;
}

export default function InvoicePreviewCard({
  data
}: InvoicePreviewCardProps) {
  // Use today's date as a fallback for the "Created" field
  const createdDate = data.issueDate ? new Date(data.issueDate).toLocaleDateString() : 'N/A';
  const dueDate = data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'N/A';

  // Check if invoice is overdue
  const isOverdue = data.dueDate && data.status !== 'PAID' && new Date() > new Date(data.dueDate);

  return (
    <div className='w-full rounded-md border flex flex-col space-y-4 bg-white cursor-pointer hover:shadow-sm transition-all duration-200 hover:-translate-y-1'>
      <div className='border-b p-4 bg-[#3D4E68] rounded-t-md flex items-center justify-between'>
        <div className='flex flex-col space-y-0.5'>
          <h1 className='font-semibold text-lg text-white'>
            {data.clientName ? truncate(data.clientName, 20) : 'Unnamed Client'}
          </h1>
          <p className='text-sm text-gray-300 font-medium'>
            {truncate(data.projectName!, 25)}
          </p>
        </div>
        {isOverdue && 
        <Badge className='bg-red-100 text-red-500'>
          Overdue
        </Badge>
        }
        {data.status === 'PAID' && <Badge className='bg-green-50 text-green-800'>Paid</Badge>}
        {data.status === 'DRAFT' && <Badge className='outline'>Draft</Badge>}
        {data.status === 'DUE' && !isOverdue && <Badge className='bg-yellow-50 text-yellow-600'>Pending</Badge>}
      </div>
      <div className='flex flex-col space-y-4 px-4'>
        <div className='flex items-center justify-between'>
          <p className='font-medium text-base text-gray-400'>
            Total
          </p>
          <p className='font-semibold text-base'>
            {data.items ? `XAF ${data.items.reduce((sum, item) => sum + ((item.units ?? item.units ?? 0) * (item.price ?? item.price ?? 0)), 0).toLocaleString()}` : 'XAF 0.00'}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='font-medium text-base text-gray-400'>
            Issue date
          </p>
          <p className='font-semibold text-base'>
            {createdDate}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='font-medium text-base text-gray-400'>
            Due date
          </p>
          <p className='font-semibold text-base'>
            {dueDate}
          </p>
        </div>
      </div>
      <div className='border-t p-2 rounded-b-md flex items-center justify-center'>
        <Button variant='ghost' className='cursor-pointer w-full text-[#3D4E68] text-base'>
          View invoice
          <ChevronRight className='text-[#3D4E68]' />
        </Button>
      </div>
    </div>
  )
}