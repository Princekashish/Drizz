import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    if (!username || !password) {
        return NextResponse.json({ error: "Please provide a correct details" }, { status: 400 });
    }
    try {
        const inserteduser = await db.insert(users).values({
            username, password
        }).returning();
        const user = inserteduser[0];
        return NextResponse.json({
            redirectUrl: `/${user.id}`
        });
    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
