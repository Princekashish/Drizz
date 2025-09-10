import { text, pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  image: varchar("image"),
  provider: varchar("provider").notNull(),
  oauth_id: text("oauthid").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  ip_addres: text("ip_address"),
  user_agent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  expiredAt: timestamp("created_at"),
});

export const roles = pgTable("roles", {
  id: uuid("id").notNull().defaultRandom(),
  name: text("name"),
  createdAt:timestamp("createdAt").defaultNow(),
});


