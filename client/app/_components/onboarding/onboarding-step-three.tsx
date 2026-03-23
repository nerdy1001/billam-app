import { OnboardingFormValues, PaymentMethodType } from "@/lib/validations/onboarding.validation";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import OnboardingHeader from "./onboarding-header";

interface Props {
  form: UseFormReturn<OnboardingFormValues>;
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


export default function OnboardingStepThree({ form }: Props) {
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentMethods",
  });

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
    <div className="flex flex-col space-y-16">
      <OnboardingHeader
        title="How do you want to get paid ?"
        description="Select one or more payment methods. Your clients will see these on the invoice."
        step={3}
      />
      <div className="flex flex-col gap-8">
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
                  "cursor-pointer p-6 border rounded-sm flex flex-col items-center gap-2 shadow-sm transition-all duration-200",
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
                    control={control}
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
                            className="h-10"
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
        </div>
      </div>
    </div>
  );
}
