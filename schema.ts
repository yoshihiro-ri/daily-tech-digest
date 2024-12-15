import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable(
  "users",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    star: integer("star").default(0),
  },
  () => []
);

export const articles = sqliteTable(
  "articles",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    isSend: integer("is_send", { mode: "boolean" }).notNull().default(false),
    posted_at: integer("posted_at"),
    created_at: integer("created_at").default(Date.now()),
    updated_at: text("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  () => []
);

export const reactions = sqliteTable(
  "reactions",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
  },
  () => []
);

export const user_articles = sqliteTable(
  "user_articles",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").references(() => users.id),
    article_id: integer("article_id").references(() => articles.id),
    reaction_id: integer("reaction_id").references(() => reactions.id),
  },
  () => []
);
