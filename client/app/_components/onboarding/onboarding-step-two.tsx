import { OnboardingFormValues } from '@/lib/validations/onboarding.validation';
import { UseFormReturn } from 'react-hook-form';
import OnboardingHeader from './onboarding-header';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageDropzone } from '../dashboard/image-dropzone';

interface OnboardingStepTwoProps {
  form: UseFormReturn<OnboardingFormValues>;
}

const OnboardingStepTwo = ({
  form
}: OnboardingStepTwoProps) => {
  return (
    <div className='flex flex-col space-y-16 xl:overflow-y-auto xl:custom-scrollbar'>
      <OnboardingHeader
        title='Tell us about your business'
        description='This information will be prefilled on every invoice that you send. You can always edit this later in settings.'
        step={2}
      />
      <div className='flex flex-col space-y-8'>
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>
                Business Name
              </FormLabel>
              <FormControl>
                <Input {...field} className="h-10" />
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
                <Input {...field} type="email" className="h-10" />
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
                <Input {...field} type="email" className="h-10" />
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
                  <Input {...field} type="text" className="h-10" />
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
                  <Input {...field} type="text" className="h-10" />
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
      </div>
    </div>
  )
}

export default OnboardingStepTwo