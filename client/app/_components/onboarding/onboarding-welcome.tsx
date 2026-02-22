'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const OnboardingWelcome = () => {

  const router = useRouter();

  return (
    <div className='flex flex-col space-y-16'>
      <div className='flex flex-col space-y-8 justify-center items-center'>
        <h1 className='font-bold text-4xl text-center'>
          Welcome to Billam
        </h1>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center justify-center'>
            <Image src={'/billam-welcome.png'} alt='onboarding-welcome' width={200} height={200} className=''/>
          </div>
          <p className='text-lg text-center font-normal text-gray-400 max-w-xl'>
            Let’s set up your business in 2 minutes so you can send your first invoice today. No complicated setup. No accounting jargon. Just clean, professional invoices that help you get paid faster.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWelcome