import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
    postedAt: integer("posted_at"),
    sendAt: integer("created_at").default(Date.now()),
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
