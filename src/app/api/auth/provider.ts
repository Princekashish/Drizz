import { db } from "@/db/drizzle";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { Account, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

interface CustomUser {
  id?: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  provider?: string;
  oauth_id?: string;
}

type TokenWithUser = JWT & { user?: CustomUser; jti?: string };

const getClientInfoFromCookies = async () => {
  const cookieStore = await cookies();
  const ip = cookieStore.get("x-client-ip")?.value || "unknown";
  const ua = cookieStore.get("x-client-ua")?.value || "unknown";
  return { ip, ua };
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

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

        // Object.assign(user, data);
        const extenduser = user as CustomUser & { customUser?: CustomUser };
        extenduser.customUser = {
          id: data.user.id.toString(),
          email: data.user.email,
          provider: data.user.provider,
          image: data.user.image,
          name: data.user.name,
          oauth_id: data.user.oauth_id,
        };
      } catch (error) {
        console.log(error);
      }

      return true;
    },

    async jwt({ token, user, trigger }) {
      const tokenWithUser = token as TokenWithUser;

      if (user && trigger === "signIn") {
        const extendedUser = user as CustomUser & { customUser?: CustomUser };
        const customUser = extendedUser.customUser;

        if (!customUser?.id) {
          throw new Error("Missing user ID");
        }

        tokenWithUser.user = customUser;
        const generatedJti = uuidv4();
        tokenWithUser.jti = generatedJti;

        try {
          const { ip, ua } = await getClientInfoFromCookies();

          await db.insert(sessions).values({
            user_id: customUser.id, // ✅ Now TypeScript is happy
            token: generatedJti,
            ip_address: ip,
            user_agent: ua,
            expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          });

          console.log("New session inserted:", generatedJti);
        } catch (err) {
          console.error("Failed to insert session:", err);
        }
      }

      if (!tokenWithUser.jti) {
        tokenWithUser.jti = uuidv4(); // fallback, but shouldn't happen
      }

      return tokenWithUser;
    },
    async session({ token, session }) {
      const customToken = token as TokenWithUser;
      if (customToken.user) {
        session.user = {
          ...session.user,
          ...customToken.user,
        };
      }

      return session;
    },

    async redirect({ baseUrl, url }) {
      if (url.startsWith(baseUrl)) {
        return baseUrl + "/news";
      }
      return url;
    },
  },
};
