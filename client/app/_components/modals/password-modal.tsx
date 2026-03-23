'use client';

import { updatePassword } from '@/app/actions/password.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModalTrigger } from '@/hooks/use-modal'
import { passwordFormValues, passwordSchema } from '@/lib/validations/password.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PasswordModal = () => {

    const passwordModalTrigger = useModalTrigger();

    const form = useForm<passwordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_new_password: ""
        }
    });

    const { mutate: changePassword, isPending: isProcessing } = useMutation({
        mutationFn: async (data: passwordFormValues) => {
            const response = await updatePassword(data.old_password, data.new_password);

            return response.message
        },

        onSuccess: (data: any) => {
            toast.success("Password updated successfully");
            

            console.log(data)
        },

        onError: (error) => {
            toast.error("Something went wrong");

            console.log(error)
        }
    })

    const onSubmitPasswordForm = async (data: passwordFormValues) => {
        await changePassword(data)
    }

  return (
    <Dialog open={passwordModalTrigger.isOpen} onOpenChange={passwordModalTrigger.onClose}>
        <DialogContent className='w-full md:max-w-125! p-8'>
            <DialogHeader>
                <DialogTitle className='text-2xl font-bold'>
                    Change your password
                </DialogTitle>
                <DialogDescription>
                    Your new password must be must be at least eight(8) characters long.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className='space-y-4' onClick={form.handleSubmit(onSubmitPasswordForm)}>
                    <FormField
                        control={form.control}
                        name='old_password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Old password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' className='h-10'  />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )} 
                    />
                    <FormField
                        control={form.control}
                        name='new_password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    New password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' className='h-10'  />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )} 
                    />
                    <FormField
                        control={form.control}
                        name='confirm_new_password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm new password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' className='h-10'  />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )} 
                    />
                    <Button type='submit' className='h-10 bg-[#1E3A8A] cursor-pointer mt-4' disabled={isProcessing}>
                        { isProcessing ? (
                            <Loader2 className='size-8 animate-spin text-white' />
                        ): 'Change password'}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default PasswordModal