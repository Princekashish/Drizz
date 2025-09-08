import { text, pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  image: varchar("image"),
  provider: varchar("provider").notNull(),
  oauth_id:text("oauthid").notNull(),
  createdAt: timestamp("created_at").defaultNow(), 
  updatedAt: timestamp("updated_at").defaultNow(), 
});
