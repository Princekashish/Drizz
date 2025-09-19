import axios from "axios";
import { Account, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface CustomeUser {
  id?: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  provider?: string;
  oauth_id?: string;
}
interface CustomSession {
  user: CustomeUser;
  expired_at: string;
}

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
      user: CustomeUser;
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
        const extenduser = user as CustomeUser & { CustomeUser?: CustomeUser };
        extenduser.CustomeUser = {
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

      // console.log(user);

      return true;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: CustomeUser & { customUser?: CustomeUser };
    }) {
      if (user?.customUser) {
        token.customUser = user.customUser;

      }

      // console.log(user);

      console.log(token);

      return token;
    },
  },
};
