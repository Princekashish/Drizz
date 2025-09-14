import { text, pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  image: varchar("image"),
  provider: varchar("provider").notNull(),
  oauth_id: text("oauthid").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at").defaultNow(),
  expired_at: timestamp("expired_at"),
});

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  created_at: timestamp("createdAt").defaultNow(),
});
