"use client";

import Image from 'next/image'
import EmptyState from '../empty-states/empty'
import { useQuery } from '@tanstack/react-query'
import { getDashboardInvoiceAnalyticsSummary, type DashboardAnalyticsResponse } from '@/app/actions/ai.actions'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'


const InsightsSummaryCard = () => {

  const session = useSession();

  const { data: insightsData, isLoading, error } = useQuery<DashboardAnalyticsResponse, Error>({
    queryKey: ['dashboard-insights', session.data?.user?.id],
    queryFn: async () => {
      if (!session.data?.user?.id) throw new Error('User not authenticated');
      const result = await getDashboardInvoiceAnalyticsSummary(session.data.user.id);
      if ('error' in result) throw new Error(result.message);
      return result;
    },
    enabled: !!session.data?.user?.id,
    // Provide server-fetched data as initial cache to avoid refetch on mount
    // initialData: initialInsights ?? undefined,
    // Tune cache/stale behaviour to avoid unnecessary refetches
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch insights:', error);
      toast.error(error.message || 'Failed to load insights');
    }
  }, [error]);

  const insights = insightsData && 'success' in insightsData ? insightsData.insights : null;

  if (isLoading) {
    return (
      <div className='bg-[#1E2638] w-full h-full rounded-md'>
        <div className='flex flex-col space-y-6 md:p-8 p-6'>
          <div className='flex items-center gap-4 md:justify-start justify-between'>
            <div className='flex items-center gap-1'>
              <Skeleton className='h-8 w-8 bg-[#3d4e6870]' />
              <Skeleton className='h-6 w-48 bg-[#3d4e6870]' />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-4 w-full bg-[#3d4e6870]' />
            <Skeleton className='h-4 w-5/6 bg-[#3d4e6870]' />
            <Skeleton className='h-4 w-3/4 bg-[#3d4e6870]' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-[#1E2638] w-full h-full rounded-md'>
        <div className='flex flex-col space-y-6 md:p-8 p-6'>
          <div className='flex items-center gap-4 md:justify-start justify-between'>
            <div className='flex items-center gap-1'>
              <Image height={30} width={30} src={'/ai.png'} alt='AI-insights' />
              <h1 className='md:text-xl text-lg font-bold tracking-tight bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                AI Summary
              </h1>
            </div>
          </div>
          <EmptyState
            title='Unable to load insights'
            description='There was an error loading your AI insights. Please try refreshing the page.'
            imgSrc='/error-state.png'
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-[#1E2638] w-full h-full rounded-md'>
        <div className='flex flex-col space-y-6 md:p-8 p-6'>
          <div className='flex items-center gap-4 md:justify-start justify-between'>
            <div className='flex items-center gap-1'>
              <h1 className='md:text-xl text-lg font-bold tracking-tight bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
                AI Summary
              </h1>
            </div>
            {/* <Button className='rounded-full shadow-none cursor-pointer font-medium' size={'sm'} variant={'outline'}>
              View all insights
            </Button> */}
          </div>
          {!insights || !insights.overallSummary || insights.overallSummary.length == 0 ? (
            <EmptyState title='Nothing to see yet' description='I do not have insights yet because there is not much to see' imgSrc='/relax-state.png' />
          ) : (
            <div className='flex flex-col md:gap-2 gap-4 p-4 bg-[#3d4e685b] rounded-sm'>
              <p className='text-base font-medium leading-7 text-gray-400'>
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