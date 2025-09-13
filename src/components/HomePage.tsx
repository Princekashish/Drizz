"use client"
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

export default function LandingPage() {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col gap-3'>
                <h1 className='text-[3em] font-bold'>Welcome to NEWS <span className='text-yellow-300'>Sections</span></h1>
                <Link href={"/news"} className='cursor-pointer'>
                    <button onClick={() => toast('login on this link /login')} className='px-7 py-3 bg-white/10 rounded-full'>Current News 24*7</button>
                </Link>
            </div>

        </div>
    )
}
