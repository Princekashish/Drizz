import { db } from "@/db/drizzle"; // your db client
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfile(props: Props) {
  const { id } = await props.params;
  console.log(id);

  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user.length) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>Welcome, {user[0].name}</h1>
    </div>
  );
}
