'use client';

import { billamMvpFeatures } from '@/app/utils/data.util'

const Features = () => {
  return (
    <section id='features' className='py-20 lg:py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl sm:text-4xl font-extrabold text-blue-950 mb-4'>
                    Everything you need to get paid, in one place
                </h2>
                <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                   Create invoices, follow up on payments, and understand your cash flow — without the complexity. 
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
                {billamMvpFeatures.map((feature) => (
                    <div key={feature.id} className='bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100'>
                        <div className='w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4'>
                            <feature.icon className='w-8 h-8 text-[#1E3A8A]' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-4'>
                            {feature.title}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Features