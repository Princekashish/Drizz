// next-auth.d.ts (or any .d.ts file included in your project)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // add id here
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string | null;
      // add other custom fields if you want
    };
  }
}
