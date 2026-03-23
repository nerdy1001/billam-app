'use client';

import { updatePhoneNumberAction } from '@/app/actions/phone-number.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePhoneNumberStore } from '@/hooks/use-phone-number';
import { usePhoneNumberModalTrigger } from '@/hooks/use-phone-number-modal';
import { phoneNumberFormValue, phoneNumberSchema } from '@/lib/validations/phoneNumber.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PhoneNumberModal = () => {

    const phoneNumberModalTrigger = usePhoneNumberModalTrigger();
    const { phoneNumber, phoneNumberExists } = usePhoneNumberStore();

    const router = useRouter();

    const form = useForm<phoneNumberFormValue>({
        resolver: zodResolver(phoneNumberSchema),
        defaultValues: {
            phoneNumber: "",
        }
    });

    const { mutate: updatePhoneNumber, isPending: isProcessing } = useMutation({
        mutationFn: async (data: phoneNumberFormValue) => {
            const response = await updatePhoneNumberAction(data.phoneNumber);

            return response.message
        },

        onSuccess: (data: any) => {
            toast.success("Phone number updated successfully");
            phoneNumberModalTrigger.onClose();

            router.refresh();

            console.log(data)
        },

        onError: (error) => {
            toast.error("Something went wrong");

            console.log(error)
        }
    })

    const onSubmitPhoneNumberForm = async (data: phoneNumberFormValue) => {
        await updatePhoneNumber(data);
    }

    useEffect(() => {
        if (phoneNumberModalTrigger.isOpen) {
            form.setValue("phoneNumber", phoneNumber || "")
        }
    }, [phoneNumberModalTrigger.isOpen, phoneNumber, form])

  return (
    <Dialog open={phoneNumberModalTrigger.isOpen} onOpenChange={phoneNumberModalTrigger.onClose}>
        <DialogContent className='w-full max-w-125! p-8'>
            <DialogHeader>
                <DialogTitle className='text-2xl'>
                    {phoneNumberExists ? "Edit your phone number" : "Add a phone number"}
                </DialogTitle>
                <DialogDescription>
                    {phoneNumberExists ? "Update the phone number we will use to share updates with you on WhatsApp" : "We will use this phone number to share updates with you on WhatsApp"}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmitPhoneNumberForm)}>
                    <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Phone Number
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type='text' className='h-10'  />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )} 
                    />
                    <Button type='submit' className='h-10 bg-[#1E3A8A] cursor-pointer mt-4'>
                        { isProcessing ? (
                            <Loader2 className='size-8 animate-spin text-white' />
                        ): (
                            phoneNumberExists ? "Update phone number" : "Add phone number"
                        )}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default PhoneNumberModal