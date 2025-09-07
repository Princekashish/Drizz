import { text, pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  name: varchar("name").notNull(),
  image: varchar("image"),
  provider: varchar("provider").notNull(),
  oauth_id:text("oauthid").notNull(),
  createdAt: timestamp("created_at").defaultNow(), // ✅ good
  updatedAt: timestamp("updated_at").defaultNow(), // ✅ fixed typo
});
