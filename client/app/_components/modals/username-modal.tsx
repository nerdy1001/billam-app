'use client';

import { updateUsernameAction } from '@/app/actions/username.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUsernameStore } from '@/hooks/use-username';
import { useUsernameModalTrigger } from '@/hooks/use-username-modal';
import { usernameFormValue, usernameSchema } from '@/lib/validations/username.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const UsernameModal = () => {

    const usernameModalTrigger = useUsernameModalTrigger();

    const { username, setUsername } = useUsernameStore();

    const router = useRouter();

    const form = useForm<usernameFormValue>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: username || "",
        }
    });

    const { mutate: updateUsername, isPending: isProcessing } = useMutation({
        mutationFn: async (data: usernameFormValue) => {
            const response = await updateUsernameAction(data.username);

            return response.message
        },

        onSuccess: (data: any) => {
            toast.success("Username updated successfully");
            usernameModalTrigger.onClose();
            setUsername(form.getValues("username"));

            router.refresh();

            console.log(data);
        },

        onError: (error) => {
            toast.error("Something went wrong");

            console.log(error);
        }
    })

    const onSubmitUsernameForm = async (data: usernameFormValue) => {
        await updateUsername(data);
    }

    useEffect(() => {
        if (usernameModalTrigger.isOpen) {
            form.setValue("username", username || "");
        }
    }, [usernameModalTrigger.isOpen, username, form]);

  return (
    <Dialog open={usernameModalTrigger.isOpen} onOpenChange={usernameModalTrigger.onClose}>
        <DialogContent className='w-full max-w-125! p-8'>
            <DialogHeader>
                <DialogTitle className='text-2xl'>
                    Edit Username
                </DialogTitle>
                <DialogDescription>
                    Please enter your username.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmitUsernameForm)}>
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Username
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
                            "Edit username"
                        )}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default UsernameModal;