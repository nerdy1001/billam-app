import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface OnboardingHeaderProps {
    title: string;
    description: string;
    step: number;
}

const OnboardingHeader = ({
    title,
    description,
    step
}: OnboardingHeaderProps) => {
  return (
    <div className='flex flex-col space-y-8'>
        <div className='flex items-center justify-between'>
            <div className='w-8 h-8 bg-[#1E3A8A] rounded-md flex items-center justify-center'> 
                <FileText className='w-4 h-4 text-white' />
            </div>
            <Badge className='bg-[#dde6ff] text-[#1E3A8A] font-semibold'>
                Step {step}/3
            </Badge>
        </div>
        <div className='flex flex-col space-y-4'>
            <h1 className='text-2xl font-bold'>
                {title}
            </h1>
            <p className='text-base text-gray-400 font-medium'>
                {description}
            </p>
        </div>
    </div>
  )
}

export default OnboardingHeader