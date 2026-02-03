import React from 'react'
import Link from 'next/link'
import { Twitter, Facebook, Instagram, Linkedin, FileText } from 'lucide-react';

interface FooterLinkProps {
    href: string;
    to?: string;
    children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, to, children }) => {
    const className = "block text-gray-400 hover:text-white transition-colors duration-200";

    if (to) {
        return (
            <Link href={to} className={className}>
                {children}
            </Link>
        )
    }

    return (
        <a href={href} className={className}>
            {children}
        </a>
    )
}

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
    return (
        <a 
            href={href}
            className='w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200'
            target='_blank'
            rel='noopener noreferrer'
        >
            {children}
        </a>
    )
}

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                <div className='space-y-4 md:col-span-2 lg:col-span-1'>
                    <Link href={'/'} className='flex items-center space-x-2 mb-6'>
                        <div className='w-8 h-8 bg-[#1E3A8A] rounded-md flex items-center justify-center'>
                            <FileText className='w-4 h-4' />
                        </div>
                        <span className='text-xl font-bold'>
                            Billam
                        </span>
                    </Link>
                    <p className='text-gray-400 leading-relaxed max-w-sm'>
                        Create professional invoices. Get paid faster.
                    </p>
                </div>
                <div>
                    <h3 className='text-base font-semibold mb-4'>
                        Product
                    </h3>
                    <ul className='space-y-2'>
                        <li>
                            <FooterLink href="#features">Features</FooterLink>
                        </li>
                        <li>
                            <FooterLink href="#testimonials">Testimonials</FooterLink>
                        </li>
                        <li>
                            <FooterLink href="#faq">FAQ</FooterLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='text-base font-semibold mb-4'>
                        Company
                    </h3>
                    <ul className='space-y-2'>
                        <li>
                            <FooterLink href="#">About Us</FooterLink>
                        </li>
                        <li>
                            <FooterLink href="#">Our team</FooterLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='text-base font-semibold mb-4'>
                        Legal
                    </h3>
                    <ul className='space-y-2'>
                        <li>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='border-t border-gray-800 py-8 mt-16'>
                <div className='flex flex-col md:flex-row justify-between items-center md:space-y-0 space-y-4'>
                    <p className='text-gray-400'>
                        &copy; {new Date().getFullYear()} Billam. All rights reserved.
                    </p>
                    <div className='flex space-x-4'>
                        <SocialLink href="https://twitter.com/yourprofile">
                            <Twitter className='w-5 h-5' />
                        </SocialLink>
                        <SocialLink href="https://facebook.com/yourprofile">
                            <Facebook className='w-5 h-5' />
                        </SocialLink>
                        <SocialLink href="https://instagram.com/yourprofile">
                            <Instagram className='w-5 h-5' />
                        </SocialLink>
                        <SocialLink href="https://linkedin.com/in/yourprofile">
                            <Linkedin className='w-5 h-5' />
                        </SocialLink>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer