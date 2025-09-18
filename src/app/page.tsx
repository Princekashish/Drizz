import LandingPage from "@/components/HomePage";
import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/provider";
import { redirect } from "next/navigation";


export default async function Home() {


  return (
    <>
      <LandingPage />
    </>
  )
}
