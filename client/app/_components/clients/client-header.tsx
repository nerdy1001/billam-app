import { getInitials } from '@/app/utils/get-initials';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Dot, Mail, MapPin, Phone } from 'lucide-react';

interface ClientHeaderProps {
    clientName: string;
    clientEmail: string | undefined | null;
    clientAddress: string | undefined | null;
    clientPhone: string;
    createdAt: Date
}

const ClientHeader = ({
    clientName,
    clientEmail,
    clientAddress,
    clientPhone,
    createdAt
}: ClientHeaderProps) => {

    const joinedDate = createdAt ? new Date(createdAt) : new Date();
    const formattedDate = format(joinedDate, 'MMMM yyyy');

  return (
    <div className='flex flex-col space-y-6 md:px-12 md:py-8 p-8 bg-white border rounded-md w-full'>
        <Avatar className='md:p-10 p-8 bg-primary border'>
            <AvatarFallback className='md:text-3xl text-2xl text-white'>
                {getInitials(clientName)}
            </AvatarFallback>
        </Avatar>
        <div className='flex flex-col space-y-2'>
            <h1 className='md:text-2xl text-lg font-semibold'>
                {clientName}
            </h1>
            <div className='flex md:flex-row flex-col md:items-center gap-1'>
                <div className='flex items-center gap-1 text-gray-400'>
                    <Mail size={16} />
                    <p className='font-medium text-sm'>
                        {clientEmail}
                    </p>
                </div>
                <Dot size={16} className='text-gray-400 hidden md:block' />
                <div className='flex items-center gap-1 text-gray-400'>
                    <Phone size={16} />
                    <p className='font-medium text-sm'>
                        {clientPhone}
                    </p>
                </div>
            </div>
            {clientAddress && (
                <div className='flex items-center gap-1 text-gray-400'>
                    <MapPin size={16} />
                    <p className='font-medium text-sm'>
                        {clientAddress}
                    </p>
                </div>
            )}
            <p className='font-medium text-sm text-gray-400'>
                Client since {formattedDate}
            </p>
        </div>
    </div>
  )
}

export default ClientHeader