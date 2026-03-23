"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PaymentMethodType } from '@/lib/validations/onboarding.validation';
import { PaymentMethodFormValues, paymentMethodSchema } from '@/lib/validations/payment-method.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateBusinessPaymentMethods } from '@/app/actions/payment-methods.actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ExistingPaymentMethod {
  method: PaymentMethodType;
  value: string;
  label?: string | null;
}

interface PaymentMethodsProps {
  /**
   * Optional array of methods from the server to populate the form with.
   */
  initialMethods?: ExistingPaymentMethod[];
}

const PAYMENT_OPTIONS: {
  value: PaymentMethodType;
  label: string;
  placeholder: string;
  imgSrc: string;
}[] = [
  {
    value: "mobile_money",
    label: "Mobile Money",
    placeholder: "(+237) 6...",
    imgSrc: "/mnos-mtn.png"
  },
  {
    value: "orange_money",
    label: "Orange Money",
    placeholder: "(+237) 6...",
    imgSrc: "/orangemoney.png"
  },
  {
    value: "credit_card",
    label: "Credit Card",
    placeholder: "4242 4242...",
    imgSrc: "/credit-card.png"
  },
];

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ initialMethods }) => {

    const router = useRouter();

    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            paymentMethods: [],
            mobileMoneyNumber: "",
            orangeMoneyNumber: "",
            cardNumber: "",
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "paymentMethods",
    });

    // mutation to save changes
    const { mutate: saveMethods, isPending: isSaving } = useMutation({
      mutationFn: async (data: PaymentMethodFormValues) => {
        const response = await updateBusinessPaymentMethods(data.paymentMethods);
        return response;
      },
      onSuccess: (resp) => {
        if ("success" in resp) {
          toast.success(resp.message || "Payment methods updated");

          router.refresh();
        } else {
          toast.error(resp.message);
        }
      },
      onError: (err: Error) => {
        console.error("Error saving payment methods:", err);
        toast.error(err.message || "Unable to save payment methods");
      }
    });

    // submit handler
    const onSubmit = async (values: PaymentMethodFormValues) => {
      saveMethods(values);
    };

    // populate form when initialMethods provided
    useEffect(() => {
      if (initialMethods && initialMethods.length) {
        // clear existing
        form.reset({
          ...form.getValues(),
          paymentMethods: initialMethods.map((m) => ({
            method: m.method,
            value: m.value,
            label: m.label ?? "",
          })),
        });
      }
    }, [initialMethods, form]);

    const selectedMethods = fields.map((f) => f.method);

    const toggleMethod = (method: PaymentMethodType) => {
        const existingIndex = fields.findIndex((f) => f.method === method);

        if (existingIndex !== -1) {
            remove(existingIndex);
        } else {
            append({
                method,
                value: "",
                label: "",
            });
        }
    };

  return (
    <div className='flex flex-col space-y-8'>
        <div className='flex flex-col space-y-1'>
            <h1 className='md:text-2xl text-xl font-bold'>
                Payment Methods
            </h1>
            <p className='text-gray-400 font-medium md:text-base text-sm'>
                Manage your business payment methods here. You can add, edit, or remove payment options to ensure seamless transactions for your customers.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* Payment Method Cards */}
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                    {PAYMENT_OPTIONS.map((option) => {
                        const selected = selectedMethods.includes(option.value);
            
                        return (
                            <motion.div
                                key={option.value}
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => toggleMethod(option.value)}
                                className={cn(
                                    "cursor-pointer p-8 border rounded-sm flex flex-col items-center gap-2 shadow-sm transition-all duration-200",
                                    selected
                                    ? "border-[#1E3A8A] text-[#1E3A8A] border-2 bg-blue-50"
                                    : "bg-white border-gray-200"
                                )}
                            >
                                <img src={option.imgSrc} alt="method-img" className="w-auto h-10" />
                                <span className="text-sm font-semibold">
                                    {option.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
                {/* Animated Inputs */}
                <div className="flex flex-col space-y-4">
                    <AnimatePresence>
                        {fields.map((field, index) => {
                            const config = PAYMENT_OPTIONS.find(
                                (p) => p.value === field.method
                            );
            
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`paymentMethods.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    {config?.label} Number
                                                </FormLabel>
                                                <FormControl>
                                                <Input
                                                    placeholder={config?.placeholder}
                                                    {...field}
                                                    className="h-10 bg-white"
                                                />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {fields.length === 0 && (
                        <p className='text-center text-gray-400 font-medium mt-4'>
                            No payment methods added yet. Click on the options above to add.
                        </p>
                    )}
                    {fields.length > 0 && (
                        <Button
                            className='font-medium mt-4 h-10 cursor-pointer bg-[#1E3A8A] hover:bg-[#081a4c] text-white self-start'
                            type='submit'
                            disabled={isSaving}
                        >
                            {isSaving ? (<Loader2 className="animate-spin" />) : 'Save changes'}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    </div>
  )
}

export default PaymentMethods