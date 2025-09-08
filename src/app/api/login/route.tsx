import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
interface LoginPayload {
    name: string,
    image: string,
    provider: string,
    oauth_id: string,
    email: string
}

export async function POST(request: NextRequest) {
    try {
        const body: LoginPayload = await request.json();
        const findUser = await db.select().from(users).where(eq(users.email, body.email))
        if (findUser.length > 0) {
            return NextResponse.json({ message: "User already exists", user: findUser[0] }, { status: 200 });
        }
        const insertUser = await db.insert(users).values(body).returning();
        const user = insertUser[0];

        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const jwtToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "365d" });
        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    ...user,
                    token: `Bearer ${jwtToken}`,
                },
            },
            { status: 201 }
        );




    } catch (error) {
        console.error("Error in login route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
