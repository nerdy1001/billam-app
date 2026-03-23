"use client";

import { ClientSummary } from '@/app/api/clients/search/route'
import { getInitials } from '@/app/utils/get-initials'
import { truncate } from '@/app/utils/trim-string.util'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, Dot, Mail, Phone } from 'lucide-react'
import millify from 'millify'

interface ClientPreviewCardProps {
    client: ClientSummary
}

const ClientPreviewCard = ({ client }: ClientPreviewCardProps) => {

  return (
    <div className='w-full rounded-md border bg-white cursor-pointer hover:shadow-sm transition-all duration-200 hover:-translate-y-1'>
        <div className='flex flex-col space-y-4 px-6 py-8'>
            <div className='flex flex-col space-y-2 justify-center items-center'>
                <Avatar className='bg-primary p-8'>
                    <AvatarFallback className='text-2xl text-white font-medium'>
                        {client.name ? getInitials(client.name) : 'C'}
                    </AvatarFallback>
                </Avatar>
                <h1 className='font-semibold text-lg'>
                    {client.name}
                </h1>
                <div className='flex items-center space-x-1'>
                    <div className='flex items-center space-x-1'>
                        <Mail className='text-gray-400' size={16}/>
                        <p className='text-sm text-gray-400 font-medium'>
                            {truncate(client.email!, 20)}
                        </p>
                    </div>
                    <Dot className='text-gray-400' size={16}/>
                    <div className='flex items-center space-x-1'>
                        <Phone className='text-gray-400' size={16}/>
                        <p className='text-sm text-gray-400 font-medium'>
                            {client.phone}
                        </p>
                    </div>
                </div>
            </div>
            <Separator />
            <div className='grid grid-cols-3 p-0.5'>
                <div className='col-span-1 flex flex-col space-y-1 justify-center items-center'>
                    <p className='text-xs font-semibold text-gray-400'>
                        Lifetime value
                    </p>
                    <h1 className='text-lg font-semibold text-green-700'>
                        {`XAF ${millify(client.lifetimeValue, { precision: 2 })}`}
                    </h1>
                </div>
                <div className='col-span-1 flex flex-col space-y-1 justify-center items-center'>
                    <p className='text-xs font-semibold text-gray-400'>
                        Outstanding
                    </p>
                    <h1 className='text-lg font-semibold text-red-700'>
                        {`XAF ${millify(client.outstanding, { precision: 2 })}`}
                    </h1>
                </div>
                <div className='col-span-1 flex flex-col space-y-1 justify-center items-center'>
                    <p className='text-xs font-semibold text-gray-400'>
                        Avg pay time
                    </p>
                    <h1 className='text-lg font-semibold text-blue-900'>
                        {client.avgPayTimeDays ? `${client.avgPayTimeDays} days` : 'N/A'}
                    </h1>
                </div>
            </div>
        </div>
        <div className='border-t p-2 rounded-b-md flex items-center justify-center'>
            <Button variant='ghost' className='cursor-pointer w-full text-[#3D4E68] text-base'>
                View client
                <ChevronRight className='text-[#3D4E68]' />
            </Button>
        </div>
    </div>
  )
}

export default ClientPreviewCard