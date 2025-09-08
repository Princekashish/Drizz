import NextAuth from "next-auth";
import { authOptions } from "../provider";

const nextauth = NextAuth(authOptions);
export { nextauth as GET, nextauth as POST };
