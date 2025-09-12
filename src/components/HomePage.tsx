import Link from 'next/link'
import React from 'react'

export default function LandingPage() {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col gap-3'>
                <h1 className='text-[3em] font-bold'>Welcome to NEWS <span className='text-yellow-300'>Sections</span></h1>
                <Link href={"/news"} className='cursor-pointer'>
                    <button className='px-7 py-3 bg-white/10 rounded-full'>Get Started</button>
                </Link>
            </div>

        </div>
    )
}
