import GoogleProvider from "next-auth/providers/google";
import { Account, AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";

export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  token?: string | null;
  image?: string | null;
  provider?: string | null;
}

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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

        const extendedUser = user as CustomUser & { customUser?: CustomUser };

        extendedUser.customUser = {
          id: data?.user?.id?.toString(),
          name: data?.user?.name,
          email: data?.user?.email,
          image: data?.user?.image,
          token: data?.user?.token,
          provider: data?.user?.provider,
        };
        return `/c/${data?.user?.id?.toString()}`;
      } catch (error) {
        console.log(error);

        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
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
      return session;
    },
  },
};
