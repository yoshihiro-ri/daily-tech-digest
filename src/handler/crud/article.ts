import { drizzle } from "drizzle-orm/d1";
import { articles } from "../../../schema";
import { Hono } from "hono";
import { desc, asc } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const article = new Hono<{ Bindings: Bindings }>();

/*****************************************
 * get articles
 *****************************************/
article.get("/", async (c): Promise<any> => {
  const db = drizzle(c.env.DB);
  const limit = c.req.query("limit");
  console.log(limit);
  if (limit) {
    const result = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.posted_at))
      .limit(Number(limit));
    return c.json(result);
  }
  const result = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.posted_at))
    .all();

  return c.json(result);
});

/*****************************************
 * create articles
 *****************************************/
article.post("/", async (c) => {
  const params = await c.req.json<typeof articles.$inferSelect>();
  const db = drizzle(c.env.DB);

  const result = await db.insert(articles).values({
    title: params.title,
    url: params.url,
    posted_at: params.posted_at,
  });

  return c.json(result);
});
export { article };
