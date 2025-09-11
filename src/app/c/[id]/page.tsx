import News from "@/components/news";
import { db } from "@/db/drizzle"; // your db client
import { users } from "@/db/schema";
import axios from "axios";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfile(props: Props) {
  const { id } = await props.params;

  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user.length) {
    return <div>User not found</div>;
  }



  return (
    <div>
      <News/>
    </div>
  );
}
