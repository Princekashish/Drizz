"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(users);
  return data;
};

