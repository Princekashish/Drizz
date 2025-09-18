import GoogleProvider from "next-auth/providers/google";
import { Account, ISODateString, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import { db } from "@/db/drizzle";
import { sessions } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
}

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   },
      // },
    }),
  ],
  session: {
    maxAge: 60, 
    updateAge: 0, 
    
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: CustomUser;
      account: Account | null;
    }) {
      try {
        const payload = {
          name: user.name,
          email: user.email,
          provider: account?.provider,
          oauth_id: account?.providerAccountId,
          image: user.image,
        };
        const { data } = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/login`,
          payload
        );

        const extendedUser = user as CustomUser & { customUser?: CustomUser };

        extendedUser.customUser = {
          id: data?.user?.id?.toString(),
          name: data?.user?.name,
          email: data?.user?.email,
          image: data?.user?.image,
          provider: data?.user?.provider,
        };
        return true;
      } catch (error) {
        console.log(error);

        return false;
      }
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        const extendeuser = user as CustomUser & { customUser?: CustomUser };
        const custom = extendeuser.customUser;
        token.user = custom;
        const customUser = token.user as CustomUser;

        try {
          if (customUser?.id && trigger === "signIn") {
            const ip = (token.ip as string) || "unknown";
            const userAgent = (token.ua as string) || "unknown";

            const sessionData = {
              user_id: customUser?.id,
              token: (token.jti as string) ?? uuidv4(),
              ip_address: ip,
              user_agent: userAgent,
              // expired_at: new Date(Date.now() + 1000 * 60 * 1)
              expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            };
            await db.insert(sessions).values(sessionData);
          }
        } catch (error) {
          console.error("Error inserting session:", error);
        }
      }
      // console.log(token);
      
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      user: CustomUser;
      token: JWT;
    }) {
      session.user = token.user as CustomUser;
      // console.log(session.user);
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return baseUrl + "/news";
      }
      return url;
    },
  },
};
