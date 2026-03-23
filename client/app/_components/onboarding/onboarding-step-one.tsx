import OnboardingHeader from './onboarding-header'
import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormValues } from '@/lib/validations/onboarding.validation'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SelectionChip from './selection-chip';
import { businessTypeOptions, industryTypeOptions } from '@/app/utils/data.util';

interface OnboardingStepOneProps {
  form: UseFormReturn<OnboardingFormValues>;
}

const OnboardingStepOne = ({
  form
}: OnboardingStepOneProps) => {
  return (
    <div className='flex flex-col space-y-16'>
      <OnboardingHeader
        title='Can you tell us about your company ?'
        description='This will help us tailor your invoice and insights experience accordingly. You can always edit this later in settings.'
        step={1}
      />
      <div className='flex flex-col space-y-8'>
        <FormField 
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className="text-base font-semibold text-foreground">
                What kind of company are you ?
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {businessTypeOptions.map((option) => (
                    <SelectionChip
                      key={option.value}
                      label={option.label}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className="text-base font-semibold text-foreground">
                What industry are you in ?
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {industryTypeOptions.map((option) => (
                    <SelectionChip
                      key={option.value}
                      label={option.label}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default OnboardingStepOne