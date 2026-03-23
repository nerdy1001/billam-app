"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInvoiceAiModal } from '@/hooks/use-create-invoice-ai-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, WandSparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseInvoiceFromTextAction } from '@/app/actions/ai.actions';
import { useAppDispatch } from '@/hooks/use-redux-hook';
import { setInvoiceData } from '@/lib/redux/features/invoice-with-ai.slice';
import { useParams, useRouter } from 'next/navigation';

const schema = z.object({
    invoiceDescription: z.string().min(1, "Invoice description is required").max(2000, "Invoice description must be less than 2000 characters"),
})

const CreateInvoiceWithAiModal = () => {

    const createInvoiceWithAiModalTrigger = useCreateInvoiceAiModal();
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const router = useRouter();
;
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            invoiceDescription: "",
        }
    })

    const { mutate: handleSubmit, isPending: isProcessing } = useMutation({
      mutationFn: async (values: { invoiceDescription: string }) => {
        // parse the invoice details with AI
        const parsed = await parseInvoiceFromTextAction(values.invoiceDescription);

        if ('error' in parsed) {
          throw new Error(parsed.message);
        }
        return parsed.invoice;
      },
      onSuccess: (result) => {
        toast.success(result.message || 'Invoice parsed successfully');
        dispatch(setInvoiceData(result));

        createInvoiceWithAiModalTrigger.onClose();
        form.reset();
        router.push(`/dashboard/${id}/invoices/new?from=ai`);
      },
      onError: (error: Error) => {
        console.error('AI invoice creation failed', error);
        toast.error(error.message || 'Unable to generate invoice from text');
      }
    });

    const onSubmit = (values: { invoiceDescription: string }) => {
      handleSubmit(values);
    };

  return (
    <Dialog open={createInvoiceWithAiModalTrigger.isOpen} onOpenChange={createInvoiceWithAiModalTrigger.onClose}>
        <DialogContent className='w-full md:max-w-150 max-w-md p-8 space-y-4'>
            <DialogHeader>
                <div className='flex items-center gap-4'>
                    <WandSparkles className='text-[#1E3A8A]'/>
                    <DialogTitle className='text-2xl font-bold'>
                        Create Invoice with AI
                    </DialogTitle>
                </div>
                <DialogDescription>
                    Paste any text that contains details about the invoice you want to create, and our AI will extract the relevant information to generate a draft invoice for you. You can then review and edit the draft before sending it to your customer.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name="invoiceDescription"
                        render={({ field }) => (
                            <FormItem className='space-y-2'>
                                <Label htmlFor="invoiceDescription" className='text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    Paste invoice details here
                                </Label>
                                <FormControl>
                                    <Textarea
                                        id="invoiceDescription"
                                        className='flex h-60 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-scroll no-scrollbar'
                                        placeholder='e.g Invoice for web design services provided to John Doe on 1st Jan 2024. Total amount: $5000. Due date: 31st Jan 2024.'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center gap-2'>
                        <Button variant={'outline'} className='h-10 cursor-pointer' onClick={() => createInvoiceWithAiModalTrigger.onClose()}>
                            Cancel
                        </Button>
                        <Button type='submit' className='h-10 bg-[#1E3A8A] cursor-pointer' disabled={isProcessing}>
                            { isProcessing ? (
                                <Loader2 className='size-8 animate-spin text-white' />
                            ): 'Create Invoice with AI'}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateInvoiceWithAiModal