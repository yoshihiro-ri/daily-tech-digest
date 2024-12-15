import { drizzle } from "drizzle-orm/d1";
import { users } from "../../../schema";
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const user = new Hono<{ Bindings: Bindings }>();

/*****************************************
 * get users
 *****************************************/
user.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
});

/*****************************************
 * create users
 *****************************************/
user.post("/", async (c) => {
  const params = await c.req.json<typeof users.$inferSelect>();
  const db = drizzle(c.env.DB);

  const result = await db.insert(users).values({
    name: params.name,
    email: params.email,
    password: params.password,
  });

  return c.json(result);
});
export { user };
