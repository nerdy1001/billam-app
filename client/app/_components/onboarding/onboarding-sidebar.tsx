import { FileText } from 'lucide-react'

const OnboardingSidebar = () => {

  return (
    <div className='bg-linear-to-bl from-[#e5eaf7] to-[#fcdbec] py-8 px-12 h-full'>
        <div className='flex flex-col space-y-4'>
            <div className='flex flex-col space-y-16'>
                <div className='flex items-center justify-center space-x-2'>
                    <div className='w-8 h-8 bg-[#1E3A8A] rounded-md flex items-center justify-center'> 
                        <FileText className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-xl font-bold text-gray-900'>
                        Billam
                    </span>
                </div>
                <div className='flex flex-col space-y-2 xl:mt-96 text-center'>
                    <h1 className='lg:text-4xl text-3xl font-bold'>
                        Everything you need to get paid, in one place
                    </h1>
                    <p className='text-base text-gray-400 font-medium'>
                        Create invoices, follow up on payments, and understand your cash flow — without the complexity.
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OnboardingSidebar