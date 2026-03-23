import { truncate } from '@/app/utils/trim-string.util';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronRight, ClockAlert } from 'lucide-react';

interface OverdueInvoiceCardProps {
    invoiceNumber: string;
    amountOverdue: number;
    daysOverdue: number;
    supposedPaymentDate: string;
    issueDate?: string;
    clientName?: string | null;
}

const OverdueInvoiceCard = ({
    invoiceNumber,
    amountOverdue,
    daysOverdue,
    issueDate,
    supposedPaymentDate,
    clientName
}: OverdueInvoiceCardProps) => {
    
  return (
    <div className='w-full rounded-md border flex flex-col space-y-4 bg-white cursor-pointer hover:shadow-sm transition-all duration-200 hover:-translate-y-1'>
        <div className='border-b p-4 bg-[#3D4E68] rounded-t-md flex items-center justify-between'>
            <div className='flex flex-col space-y-0.5'>
                <h1 className='font-semibold text-lg text-white'>
                    {clientName ? truncate(clientName, 20) : 'Unnamed Client'}
                </h1>
                <p className='text-sm text-gray-300 font-medium'>
                    {invoiceNumber}
                </p>
            </div>
            <Badge className='bg-red-100 text-red-500'>
                Overdue
            </Badge>
        </div>
        <div className='flex flex-col space-y-4 px-4'>
            <div className='flex items-center justify-between'>
                <p className='font-medium text-base text-gray-400'>
                    Total
                </p>
                <p className='font-semibold text-base'>
                    {`XAF ${amountOverdue.toLocaleString()}`}
                </p>
            </div>
            <div className='flex items-center justify-between'>
                <p className='font-medium text-base text-gray-400'>
                    Issue date
                </p>
                <p className='font-semibold text-base'>
                    {issueDate}
                </p>
            </div>
            <div className='flex items-center justify-between'>
                <p className='font-medium text-base text-gray-400'>
                    Overdue
                </p>
                <div className='flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-full'>
                    <ClockAlert size={18} className='text-red-500' />
                    <p className='font-semibold text-base text-red-500'>
                        {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} ({supposedPaymentDate})
                    </p>
                </div>
            </div>
        </div>
        <div className='border-t p-2 rounded-b-md flex items-center justify-end space-x-2'>
            <Button variant='ghost' className='cursor-pointer text-[#3D4E68] text-base'>
                View invoice
            </Button>
            <Button className='bg-red-700 cursor-pointer'>
                Send reminder
            </Button>
        </div>
    </div>
  )
}

export default OverdueInvoiceCard