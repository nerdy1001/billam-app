'use client';

import { Button } from '@/components/ui/button'
import { useCreateInvoiceAiModal } from '@/hooks/use-create-invoice-ai-modal';
import { WandSparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'


const InvoiceHeader = () => {

    const router = useRouter();

    const params = useParams();
    const accountId = params.id as string;

    const createInvoiceWithAiModalTrigger = useCreateInvoiceAiModal();

  return (
    <div className='flex md:flex-row flex-col gap-8 md:items-center justify-between'>
        <h1 className='text-3xl font-bold'>
            Invoices
        </h1>
        <div className='flex items-center gap-2'>
            <Button variant={'outline'} className='cursor-pointer hover:text-[#1E3A8A]' onClick={() => createInvoiceWithAiModalTrigger.onOpen()}>
                <WandSparkles size={25} className='hover:text-indigo-500' />
                Create with AI
            </Button>
            <Button className='bg-[#1E3A8A] text-white cursor-pointer' size='default' onClick={() => router.push(`/dashboard/${accountId}/invoices/new`)}>
                Create New Invoice
            </Button>
        </div>
    </div>
  )
}

export default InvoiceHeader