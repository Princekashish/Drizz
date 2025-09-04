import { drizzle } from "drizzle-orm/neon-http";
if (!process.env.DATABASE_URL) {
  throw new Error("DB is not connected");
}

export const db = drizzle(process.env.DATABASE_URL);
