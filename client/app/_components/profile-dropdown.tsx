'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProfileDropdownProps {
    id: string;
    isOpen: boolean;
    onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
    avatar: string;
    companyName: string;
    email: string;
    onLogout: () => void;
}

const ProfileDropdown = ({ 
    id,
    isOpen, 
    onToggle, 
    avatar, 
    companyName, 
    email, 
    onLogout 
}: ProfileDropdownProps) => {

    const router = useRouter();

  return (
    <div className='relative'>
        <Button
            variant="ghost"
            onClick={onToggle}
            className='flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer'
        >
            {avatar ? (
                <Image src={avatar} alt='avatar' className='rounded-md' width={35} height={35} />
            ): (
                <div className='h-8 w-8 bg-linear-to-br from-[#1E3A8A] to-blue-800 rounded-full flex items-center justify-center'>
                    <span className='text-white font-semibold text-sm'>
                        {companyName.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
            <div className='hidden sm:block text-left'>
                <p className='text-sm font-medium text-gray-900'>
                    {companyName}
                </p>
                <p className='text-xs text-gray-500'>
                    {email}
                </p>
            </div>
            <ChevronDown className='h-4 w-4 text-gray-400' />
        </Button>
        {isOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 z-50'>
                <div className='px-4 py-3 border-b border-gray-100'>
                    <p className='text-sm font-medium text-gray-900'>
                        {companyName}
                    </p>
                    <p className='text-xs text-gray-500'>
                        {email}
                    </p>
                </div>
                <a onClick={() => router.push("/dashboard")} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>
                    Go to dashboard
                </a>
                <div>
                    <a 
                        href="#" 
                        onClick={onLogout}
                        className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors'
                    >
                        Sign out
                    </a>
                </div>
            </div>
        )}
    </div>
  )
}

export default ProfileDropdown