import { ClockAlert } from 'lucide-react';
import millify from 'millify'

interface OverdueInvoiceCardProps {
    invoiceNumber: string;
    amountOverdue: number;
    daysOverdue: number;
    supposedPaymentDate: string;
}

const OverdueInvoiceCard = ({
    invoiceNumber,
    amountOverdue,
    daysOverdue,
    supposedPaymentDate
}: OverdueInvoiceCardProps) => {
  return (
    <div className='border border-gray-200 flex flex-col justify-between p-4 bg-white rounded-md h-40 hover:shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1'>
        <p className='text-sm text-gray-400 font-medium'>
                {invoiceNumber}
            </p>
            <div className='flex flex-col space-y-2'>
                <h1 className='font-bold md:text-2xl text-xl'>
                   {`FCFA ${millify(amountOverdue)}`}
                </h1>
                <div className='bg-red-50 p-2 rounded-full w-fit'>
                    <div className='flex items-center gap-2'>
                        <ClockAlert size={20} className='text-red-500' />
                        <p className='text-red-500 text-sm font-medium'>
                            {daysOverdue} days overdue ({supposedPaymentDate})
                        </p>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default OverdueInvoiceCard