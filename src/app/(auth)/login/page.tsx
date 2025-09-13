"use client"
import { signIn } from 'next-auth/react'
import React from 'react'

export default function Login() {
    const handleLogin = () => {
        signIn("google")
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <button onClick={handleLogin} className='border border-dashed rounded-full px-4 py-3' >Sign up with Google</button>
        </div>
    )
}
