"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ClientDetailsFormValues, clientDetailsSchema } from '@/lib/validations/client-details.validation';
import { updateClient } from '@/app/actions/client.actions';
import { useParams, useRouter } from 'next/navigation';

interface ClientDetailsProps {
  initialData?: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ initialData }) => {

    const params = useParams();
    const clientId = params.clientId as string;

    const router = useRouter();

    const form = useForm<ClientDetailsFormValues>({
        resolver: zodResolver(clientDetailsSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: ""
        }
    });

    // derive loading state from props
    const isLoading = initialData === undefined;

    useEffect(() => {
    if (initialData) {
        form.reset({
            name:    initialData.name    ?? "",
            phone:   initialData.phone   ?? "",
            email:   initialData.email   ?? "",
            address: initialData.address ?? "",
        });
    }
    }, [initialData, form]);

    console.log("Initial business data:", initialData);

    // Setup mutation for submitting business details
    const { mutate: submitBusinessDetails, isPending: isSubmitting } = useMutation({
        mutationFn: async (data: ClientDetailsFormValues) => {
            return await updateClient(clientId, data);
        },
        onSuccess: (response) => {
            if (!response.success) {
                toast.error(response.error);
                return;
            }

            router.refresh();
            
        },
        onError: (error: Error) => {
            // Handle network errors and other unexpected errors
            console.error("Error submitting business details:", error);
            
            const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
            toast.error(errorMessage);
        }
    });

    /**
     * Production-grade onSubmit handler with comprehensive error handling
     * Validates form data and submits to server
     */
    const onSubmit = async (data: ClientDetailsFormValues) => {
        try {
            // Validate form data with Zod schema
            const validatedData = clientDetailsSchema.parse(data);

            console.log("Validated business details:", validatedData);
            
            // Submit validated data
            submitBusinessDetails(validatedData);
        } catch (error) {
            // Handle client-side validation errors
            if (error instanceof Error) {
                console.error("Validation error:", error.message);
                toast.error("Please check all required fields and try again");
            } else {
                console.error("Unexpected error during validation:", error);
                toast.error("An unexpected error occurred. Please refresh and try again.");
            }
        }
    };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-8'>
        <div className='flex flex-col space-y-2'>
            <h2 className='md:text-2xl text-xl font-bold'>
                Client Details
            </h2>
            <p className='font-medium text-gray-400 md:text-base text-sm'>
                Update your client details here. These details will be used in your invoices and other communications with your customers.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-semibold'>
                                Client Name
                            </FormLabel>
                            <FormControl>
                                <Input {...field} className="h-10 bg-white" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                        <FormLabel className='font-semibold'>
                            Phone Number 1
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="text" className="h-10 bg-white" />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Client Email
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="email" className="h-10 bg-white" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Client address
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="text" className="h-10 bg-white" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <Button 
                    className="bg-[#1E3A8A] rounded-sm cursor-pointer w-28 mt-4 h-10" 
                    type="submit"
                    disabled={isSubmitting || !form.formState.isDirty}
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Save changes"
                    )}
                </Button>
                {/* <div className="flex items-center gap-2 my-8">
                    {isLoading ? (
                        <Button className="bg-[#1E3A8A] rounded-sm cursor-pointer w-25" type="submit" disabled={isLoading}>
                            <Loader2 className="animate-spin" />
                        </Button>
                    ): (
                        <Button className="bg-[#1E3A8A] rounded-sm cursor-pointer w-28" type="submit" disabled={isLoading}>
                            Save changes
                        </Button>
                    )}
                </div> */}
            </form>
        </Form>
    </div>
  )
}

export default ClientDetails