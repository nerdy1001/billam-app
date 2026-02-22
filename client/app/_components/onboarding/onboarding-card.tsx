import { LucideIcon } from 'lucide-react';

interface OnboardingCardProps {
    title: string;
    description: string;
    Icon: LucideIcon;
}

const OnboardingCard = ({
    title,
    description,
    Icon
}: OnboardingCardProps) => {
  return (
    <div className='bg-transparent flex flex-col space-y-3 cursor-pointer rounded-md p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100'>
        <div className='flex items-center space-x-2'>
            <Icon className='w-5 h-5 text-[#1E3A8A]' />
            <h1 className='text-lg font-semibold'>
                {title}
            </h1>
        </div>
        <p className='text-sm text-gray-400 font-normal leading-7'>
            {description}
        </p>
    </div>
  )
}

export default OnboardingCard