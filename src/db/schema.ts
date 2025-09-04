import { text, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // ✅ generates UUID
  username: text("username").notNull().unique(), // ✅ fixed typo
  password: text("password").notNull(),          // ✅ fixed typo
  createdAt: timestamp("created_at").defaultNow(), // ✅ good
  updatedAt: timestamp("updated_at").defaultNow(), // ✅ fixed typo
});
