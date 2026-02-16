'use client'

import { useSession } from '@/lib/auth-client';

const Intro = () => {

    const session = useSession();

  return (
    <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold'>
            Welcome back, {session.data?.user.name}
        </h1>
        <p className='text-md font-medium text-gray-400'>
            Here is a quick snapshot of your invoice activity and AI insights
        </p>
    </div>
  )
}

export default Intro