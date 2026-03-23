import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface SettingsHeaderProps {
    username: string;
    email: string;
}

const SettingsHeader = ({
    username,
    email
}: SettingsHeaderProps) => {
  return (
    <div className='flex items-center space-x-4 md:p-8 p-4 bg-zinc-100 rounded-md'>
        <Avatar className='md:p-10 p-8 bg-white border'>
            <AvatarFallback className='md:text-3xl text-2xl'>
                {username ? username.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
        </Avatar>
        <div className='flex flex-col space-y-1'>
            <h1 className='md:text-2xl text-xl font-semibold'>
                {username}
            </h1>
            <p className='md:text-base text-sm text-gray-400 font-medium'>
                {email}
            </p>
        </div>
    </div>
  )
}

export default SettingsHeader