"use client"
import axios from 'axios'
import React, { useState } from 'react'

type user = {
    username: string,
    password: string,
}

export default function Login() {
    const [profile, setProfile] = useState<user>({
        username: "",
        password: ""
    })
    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((pre) => ({ ...pre, [name]: value }))

    }
    const handlesubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const resp = axios.post('/api/users', profile, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const { redirectUrl } = (await resp).data;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }

        } catch (error) {
            console.log(error);


        }
    }
    console.log(profile);

    return (
        <div className="flex justify-center items-center   h-screen">
            <div className=" bg-zinc-900 h-1/2 w-1/2 flex-col relative text-start rounded-4xl justify-center items-center  flex  gap-2">
                <div className=' flex flex-col gap-5'>
                    <div className='w-1/2 flex gap-5'>
                        <label className='w-1/2'>username</label>
                        <input type="text" onChange={handlechange} value={profile.username} name='username' className="bg-white/10 outline-none rounded-md px-3 " />
                    </div>
                    <div className='w-1/2 flex gap-5'>
                        <label className='w-1/2'>Password</label>
                        <input type="password"
                            value={profile.password}
                            onChange={handlechange}
                            name="password" className="bg-white/10 outline-none rounded-md px-3 " />
                    </div>
                </div>
                <button onClick={handlesubmit} className='absolute bottom-5 right-20 bg-white/30 rounded-2xl px-4 py-2 '>Submit</button>

            </div>
            <div>

            </div>
        </div>
    )
}
