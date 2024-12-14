import { drizzle } from "drizzle-orm/d1";
import { users } from "../schema";
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const crud_users = new Hono<{ Bindings: Bindings }>();

/*****************************************
 * get users
 *****************************************/
crud_users.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
});

/*****************************************
 * create users
 *****************************************/
crud_users.post("/", async (c) => {
  const params = await c.req.json<typeof users.$inferSelect>();
  const db = drizzle(c.env.DB);

  const result = await db.insert(users).values({
    name: params.name,
    email: params.email,
    password: params.password,
  });

  return c.json(result);
});
export { crud_users };
