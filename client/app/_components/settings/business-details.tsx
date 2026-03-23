"use client";

import { businessTypeOptions, industryTypeOptions } from '@/app/utils/data.util';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessDetailsFormValues, businessDetailsSchema } from '@/lib/validations/business-details.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ImageDropzone } from '../dashboard/image-dropzone';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateBusinessDetails } from '@/app/actions/business.actions';

interface BusinessDetailsProps {
  /**
   * Data fetched from `getBusinessDetails()`.
   * `null` when the user has no business yet; undefined when loading.
   */
  initialData?: BusinessDetailsFormValues | null;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ initialData }) => {

    const form = useForm<BusinessDetailsFormValues>({
        resolver: zodResolver(businessDetailsSchema),
        defaultValues: {
            businessType: "tech_startup",
            industry: "technology",
            businessName: "",
            businessAddress: "",
            businessEmail: "",
            phoneNumber1: "",
            phoneNumber2: "",
            logo: undefined as any,
        }
    });

    // derive loading state from props
    const isLoading = initialData === undefined;

    // populate the form whenever initialData arrives
    useEffect(() => {
        if (initialData) {
            form.reset(initialData as BusinessDetailsFormValues)
        }
    }, [initialData, form]);

    console.log("Initial business data:", initialData);

    // Setup mutation for submitting business details
    const { mutate: submitBusinessDetails, isPending: isSubmitting } = useMutation({
        mutationFn: async (data: BusinessDetailsFormValues) => {
            return await updateBusinessDetails(data);
        },
        onSuccess: (response) => {
            if ('success' in response && response.success) {
                toast.success(response.message || "Business details updated successfully");
                // Optional: Reset form or refetch data here
            } else {
                toast.error(response.message || "Failed to update business details");
            }
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
    const onSubmit = async (data: BusinessDetailsFormValues) => {
        try {
            // Validate form data with Zod schema
            const validatedData = businessDetailsSchema.parse(data);

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
                Business Details
            </h2>
            <p className='font-medium text-gray-400 md:text-base text-sm'>
                Update your business details here. These details will be used in your invoices and other communications with your customers.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
                <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Business Type
                            </FormLabel>
                            <FormControl>
                                {/* keep the select controlled; never pass undefined */}
                                <Select
                                  onValueChange={(value) => field.onChange(value)}
                                  value={field.value || ""}
                                >
                                    <SelectTrigger className="w-full py-5 cursor-pointer bg-white">
                                        <SelectValue placeholder="Select your business type" />
                                    </SelectTrigger>
                                    <SelectContent position='popper'>
                                        {businessTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Industry 
                            </FormLabel>
                            <FormControl>
                                {/* keep the select controlled; never pass undefined */}
                                <Select
                                  onValueChange={(value) => field.onChange(value)}
                                  value={field.value || ""}
                                >
                                    <SelectTrigger className="w-full py-5 cursor-pointer bg-white">
                                        <SelectValue placeholder="Select your business industry" />
                                    </SelectTrigger>
                                    <SelectContent position='popper'>
                                        {industryTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Business Name
                        </FormLabel>
                        <FormControl>
                            <Input {...field} className="h-10 bg-white" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Business Email
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="email" className="h-10 bg-white" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Business Address
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="text" className="h-10 bg-white" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <div className='flex items-center space-x-2'>
                    <FormField
                    control={form.control}
                    name="phoneNumber1"
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
                    name="phoneNumber2"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                        <FormLabel className='font-semibold'>
                            Phone Number 2<span className='text-gray-400'>(Optional)</span>
                        </FormLabel>
                        <FormControl>
                            <Input {...field} type="text" className="h-10 bg-white" />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>
                            Business Logo
                        </FormLabel>
                        <ImageDropzone 
                            onChange={(file) => field.onChange(file)} 
                            value={field.value}
                        />
                    </FormItem>
                    )}
                />
                <Button 
                    className="bg-[#1E3A8A] rounded-sm cursor-pointer w-28 mt-8 h-10" 
                    type="submit"
                    disabled={isSubmitting}
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

export default BusinessDetails