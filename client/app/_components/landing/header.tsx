'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ProfileDropdown from '../profile-dropdown';
import { useRouter } from 'next/navigation';

const Header = () => {

    const [isScolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const router = useRouter();

    const isAuthenticated = false; // Replace with actual authentication logic
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: ""
    }
    const logout = () => {
        // Implement logout logic
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

  return (
    <header className={cn('fixed top-0 w-full z-50 transition-all duration-300 bg-gray-100', isScolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white/0')}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16 lg:h-20'>
                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-[#1E3A8A] rounded-md flex items-center justify-center'> 
                        <FileText className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-xl font-bold text-gray-900'>
                        Billam
                    </span>
                </div>
                <div className='hidden lg:flex lg:items-center lg:space-x-8'>
                    <a href="#features" className='text-gray-600 hover:text-gray-900 font-medium duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1E3A8A] after:transition-all hover:after:w-full'>
                        Features
                    </a>
                    <a href="#testimonials" className='text-gray-600 hover:text-gray-900 font-medium duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1E3A8A] after:transition-all hover:after:w-full'>
                        Testimonials
                    </a>
                    <a href="#faq" className='text-gray-600 hover:text-gray-900 font-medium duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1E3A8A] after:transition-all hover:after:w-full'>
                        FAQ
                    </a>
                </div>
                <div className='hidden lg:flex items-center space-x-4'>
                   {isAuthenticated ? (
                    <>
                        <ProfileDropdown
                            id="xyz"
                            isOpen={profileDropdownOpen}
                            onToggle={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={user?.avatar || ''}
                            companyName={user?.name || ''}
                            email={user?.email || ''}
                            onLogout={logout}
                        />
                    </>
                   ): (
                    <>
                        <Link href="/login" className='text-black hover:text-gray-900 font-medium transition-colors duration-200'>
                            Login
                        </Link>
                        <Link href="/signup" className='bg-linear-to-r from-blue-950 to-[#1E3A8A] hover:bg-gray-600 text-white px-6 py-2.5 font-medium transition-all duration-200 hover:scale-105 shadow-md rounded-md'>
                            Sign Up
                        </Link>
                    </>
                   )} 
                </div>
                <div className='lg:hidden'>
                    <Button variant={'ghost'} onClick={() => setMenuOpen(!menuOpen)} className='p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200'>
                        {menuOpen ? (
                            <X className='w-8 h-8' />
                        ) : (
                            <Menu className='w-8 h-8' />
                        )}
                    </Button>
                </div>
            </div>
        </div>
        {menuOpen && (
            <div className='lg:hidden absolute top-full left-0 right-0 bg-white border-0 border-gray-200 shadow-md'>
                <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                    <a 
                        href="#features"
                        className='block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200'
                    >
                        Features
                    </a>
                     <a 
                        href="#testimonials"
                        className='block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200'
                    >
                        Testimonials
                    </a>
                     <a 
                        href="#faq"
                        className='block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200'
                    >
                        FAQ
                    </a>
                    <div className='border-t border-gray-200 my-2'></div>
                    {isAuthenticated ? (
                        <div className='p-4'>
                            <Button
                                onClick={() => router.push('/dashboard/xyz')}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    ): (
                        <>
                            <Link href="/login" className='block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200'>
                                Login
                            </Link>
                            <Link href="/signup" className='block w-full rounded-md text-left bg-linear-to-r from-blue-950 to-[#1E3A8A] hover:bg-gray-800 text-white px-4 py-3 font-medium transition-all duration-200'>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )}
    </header>
  )
}

export default Header