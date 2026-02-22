import { Button } from '@/components/ui/button'
import { BusinessRecommendationInsights } from '@/lib/types'
import Image from 'next/image'
import EmptyState from '../empty-states/empty'
import { Separator } from '@/components/ui/separator'


interface InsightsSummaryCardProps {
  insights?: BusinessRecommendationInsights | null,
}

const InsightsSummaryCard = ({
  insights,
}: InsightsSummaryCardProps) => {
  return (
    <>
      <div className='border border-gray-200 bg-white w-full rounded-md'>
        <div className='flex flex-col space-y-6 md:p-8 p-6'>
          <div className='flex items-center gap-4 md:justify-start justify-between'>
            <div className='flex items-center gap-1'>
              <Image height={30} width={30} src={'/ai.png'} alt='AI-insights' />
              <h1 className='md:text-xl text-lg font-bold tracking-tight bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                AI Summary
              </h1>
            </div>
            <Button className='rounded-full shadow-none cursor-pointer font-medium' size={'sm'} variant={'outline'}>
              View all insights
            </Button>
          </div>
          {!insights || !insights.overallSummary || insights.overallSummary.length == 0 ? (
            <EmptyState title='Nothing to see yet' description='I do not have insights yet because there is not much to see' imgSrc='/relax-state.png' />
          ) : (
            <div className='flex flex-col md:gap-2 gap-4 p-4 bg-gray-50 rounded-sm'>
              <p className='text-base font-medium leading-7'>
                {insights.overallSummary}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default InsightsSummaryCard