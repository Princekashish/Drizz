import Link from 'next/link';
import React from 'react'
export default function Navbar() {

    return (
        <div className=' px-5 py-3 flex justify-between items-center '>
            <div className=" flex items-center gap-4">
                <h1 className='font-bold text-[1.4em] text-amber-400'> News Pinch</h1>
            </div>

              <Link href={"/login"}>
                <button  className='px-4 py-2 rounded-3xl bg-white/20 '>Login</button>
            </Link>
        </div>
    );
}
