import Navbar from '@/components/navbar'
import NewsPage from '@/components/NewsPage'
import React from 'react'
import { authOptions } from '../api/auth/provider';
import { getServerSession } from 'next-auth';

export default async function News() {
    const session = await getServerSession(authOptions);
    // console.log(session);
    

    return (
        <div>
            <Navbar session={session} />
            <NewsPage />
        </div>
    )
}
