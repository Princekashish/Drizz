import { authOptions } from '@/app/api/auth/provider'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function Navbar() {
    const session = await getServerSession(authOptions);

    console.log("Session:", session);
    if (!session) {
        return (
            <div className="p-4">
                <h1>You're not signed in</h1>
            </div>
        );
    }

    return (
        <div className="p-4 flex items-center gap-4">
            <h1>Hey, {session.user?.name}</h1>
            {session.user?.image && (
                <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 rounded-full"
                />
            )}
        </div>
    );
}
