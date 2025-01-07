import React from 'react'
import Image from "next/image"
import Link from "next/link"
import logo from "@/images/icons8-ticket-64.png";
import { SignedOut, SignInButton, UserButton, SignedIn } from '@clerk/nextjs';
import SearchBar from './SearchBar';
import { Button } from './ui/button';

export default function Header() {
  return (
    <div className='border-b'>

      <div className='flex flex-col lg:flex-row items-center gap-4 p-4'>
        <div className='flex items-center justify-between w-full lg:w-auto'>
          <Link href="/" className="font-bold shrink-0">

            <Image
              src={logo}
              alt='logo'
              width={100}
              height={100}
              className="w-24 lg:w-28"
            />


          </Link>
          <div className='lg:hidden'>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>

              <SignInButton mode='modal'>
                <button className='bg-gray-100  text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300'>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className='w-full lg:max-w-2xl'>
          <SearchBar />
        </div>

        <div className='hidden lg:block ml-auto '>
          <SignedIn>

            <div className='flex items-center gap-3'>
              <Link href="/seller">
                <Button className='bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition'>

                  Sell Tickets
                </Button>
              </Link>

              <Link href="/tickets">
                <Button className='bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition'>

                  My  Tickets
                </Button>
              </Link>

              <UserButton />
            </div>
          </SignedIn>

          <SignedOut >
            <SignInButton mode='modal' >

              <button className='bg-gray-100  text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300'>
                Sign In
              </button>

            </SignInButton>
          </SignedOut>
        </div>


        <div className='lg:hidden w-full flex justify-center gap-3'>
          <SignedIn>

            <div className='flex items-center gap-3'>
              <Link href="/seller">
                <Button className='bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition'>

                  Sell Tickets
                </Button>
              </Link>

              <Link href="/tickets">
                <Button className='bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition'>

                  My  Tickets
                </Button>
              </Link>

            </div>
          </SignedIn>

         
        </div>
      </div>
    </div>
  )
}
