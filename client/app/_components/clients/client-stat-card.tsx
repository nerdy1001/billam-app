import React from 'react'

interface SubtitleProps {
    label: string;
    trend: 'up' | 'down' | 'neutral';
}

interface ClientStatCardProps {
    label: string;
    value: string | number;
    subtitle: SubtitleProps;
}

const ClientStatCard = ({
    label,
    value,
    subtitle
}: ClientStatCardProps) => {

    const trendStyles = {
        up: "text-emerald-600",
        down: "text-red-500",
        neutral: "text-gray-400",
    };

    const trendArrow = {
        up: "↑",
        down: "↓",
        neutral: "",
    };

  return (
    <div className='w-full rounded-md border flex flex-col space-y-4 bg-white cursor-pointer hover:shadow-sm transition-all duration-200 hover:-translate-y-1'>
        <div className='px-4 py-2 bg-gray-100 rounded-t-md flex'>
            <p className='text-gray-500 font-medium text-sm'>
                {label}
            </p>
        </div>
        <div className='flex flex-col px-4 mb-4'>
            <div className='flex flex-col space-y-2'>
                <p className='text-2xl font-bold'>
                    {value}
                </p>
                <p className={`text-sm font-medium ${trendStyles[subtitle.trend]}`}>
                    {trendArrow[subtitle.trend]} {subtitle.label}
                </p>
            </div>
        </div>
    </div>
  )
}

export default ClientStatCard