'use client'

import { Separator } from '@/components/ui/separator';
import { useModalTrigger } from '@/hooks/use-modal';
import { usePhoneNumberStore } from '@/hooks/use-phone-number';
import { usePhoneNumberModalTrigger } from '@/hooks/use-phone-number-modal';
import { useUsernameStore } from '@/hooks/use-username';
import { useUsernameModalTrigger } from '@/hooks/use-username-modal';
import { useEffect } from 'react';

interface AccountSettingsProps {
    username: string;
    phoneNumber?: string;
}

const AccountSettings = ({
    username,
    phoneNumber
}: AccountSettingsProps) => {

    const passwordModalTrigger = useModalTrigger();
    const phoneNumberModalTrigger = usePhoneNumberModalTrigger();
    const usernameModalTrigger = useUsernameModalTrigger();

    const { setPhoneNumber, setPhoneNumberExists } = usePhoneNumberStore();
    const { setUsername } = useUsernameStore();

    useEffect(() => {
        setPhoneNumberExists(!!phoneNumber);
        setPhoneNumber(phoneNumber);
        setUsername(username);
    }, [phoneNumber, username, setPhoneNumber, setUsername])

  return (
    <div className='flex flex-col space-y-12'>
        <div className='flex flex-col space-y-8'>
            <h1 className='md:text-2xl text-xl font-bold'>
                Personal Details
            </h1>
            <div className='flex flex-col space-y-8'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col space-y-1'>
                        <h6 className='md:text-lg text-base font-semibold'>
                            Full Name
                        </h6>
                        <p className='text-sm font-medium text-gray-400'>
                            {username}
                        </p>
                    </div>
                    <p className='text-base underline text-[#1E3A8A] font-semibold cursor-pointer' onClick={() => usernameModalTrigger.onOpen()}>
                        Edit
                    </p>
                </div>
                <div className='flex items-center gap-16 justify-between'>
                    <div className='flex flex-col space-y-1'>
                        <h6 className='md:text-lg text-base font-semibold'>
                            Phone Number
                        </h6>
                        <p className='text-sm font-medium text-gray-400'>
                            {phoneNumber ? phoneNumber : "We will use this phone number to share updates with you on WhatsApp"}
                        </p>
                    </div>
                    <p className='text-base underline text-[#1E3A8A] font-semibold cursor-pointer' onClick={() => phoneNumberModalTrigger.onOpen()}>
                        {phoneNumber ? "Edit" : "Add"}
                    </p>
                </div>
            </div>
        </div>
        <Separator />
        <div className='flex flex-col space-y-8'>
            <h1 className='md:text-2xl text-xl font-bold'>
                Account Security
            </h1>
            <div className='flex flex-col space-y-8'>
                <div className='flex items-center gap-16 justify-between'>
                    <div className='flex flex-col space-y-1'>
                        <h6 className='md:text-lg text-base font-semibold'>
                            Change Password
                        </h6>
                        <p className='text-sm font-medium text-gray-400'>
                            Set a new password for this account.
                        </p>
                    </div>
                    <p className='text-base underline text-[#1E3A8A] font-semibold cursor-pointer'  onClick={() => passwordModalTrigger.onOpen()}>
                        Change
                    </p>
                </div>
            </div>
        </div>
        {/* <Separator />
        <div className='flex flex-col space-y-8'>
            <div className='flex items-center space-x-2'>
                <h1 className='text-2xl font-bold'>
                    Red Zone
                </h1>
                <AlertTriangle className='text-red-700' />
            </div>
            <div className='flex flex-col space-y-8'>
                <div className='flex items-center gap-12 justify-between'>
                    <div className='flex flex-col space-y-1'>
                        <h6 className='text-lg font-semibold'>
                            Delete my account
                        </h6>
                        <p className='text-sm font-medium text-gray-400'>
                            Permanently delete your account. You will no longer be able to access invoice history, client list and insights
                        </p>
                    </div>
                    <Button className='bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 h-10 cursor-pointer font-semibold'>
                        Delete account
                    </Button>
                </div>
            </div>
        </div> */}
    </div>
  )
}

export default AccountSettings