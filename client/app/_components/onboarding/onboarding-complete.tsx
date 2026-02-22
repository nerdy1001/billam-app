import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface OnboardingCompleteProps {
  businessId?: string;
}

const OnboardingComplete = ({
  businessId
}: OnboardingCompleteProps) => {

  const router = useRouter();

  return (
    <div className='flex flex-col space-y-16'>
      <div className='flex flex-col space-y-8 justify-center items-center'>
        <h1 className='font-bold text-4xl text-center'>
          You’re ready to get paid 🚀
        </h1>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center justify-center'>
            <Image src={'/billam-success.png'} alt='onboarding-welcome' width={200} height={200} className=''/>
          </div>
          <p className='text-lg text-center font-normal text-gray-400 max-w-xl'>
            You are now ready to create your first invoice. Billam will help you stay organized and professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingComplete