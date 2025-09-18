import Navbar from '@/components/navbar'
import NewsPage from '@/components/NewsPage'
import React from 'react'
import { authOptions } from '../api/auth/provider';
import { getServerSession } from 'next-auth';
import { db } from '@/db/drizzle';
import { and, eq, gte } from 'drizzle-orm';
import { sessions } from '@/db/schema';

export default async function News() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <p>You are not logged in or session expired</p>;
    }

    // Manually check your DB session expiration:
    const sessionId = session.user?.id;
    if (!sessionId) {
        return <p>Session invalid</p>;
    }

    const activeSession = await db.select().from(sessions).where(
        and(
            eq(sessions.user_id, sessionId),
            gte(sessions.expired_at, new Date())
        )
    ).limit(1)



    if (activeSession.length === 0) {
        return <p>Your session expired in DB</p>;
    }
    return (
        <div>
            <Navbar session={session} />
            <NewsPage />
        </div>
    )
}
