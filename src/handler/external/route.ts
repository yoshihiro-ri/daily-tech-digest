import { Hono } from "hono";
import { send } from "./send";
import { drizzle } from "drizzle-orm/d1";

import { scrape } from "./scrape";

type Bindings = {
  DB: D1Database;
};

const external = new Hono<{ Bindings: Bindings }>();

external.get("/", (c) => c.text("external!"));

// 記事のクロール
external.get("/scrape", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await scrape(db);
  return c.json(result);
});

// 記事の配信
external.get("/send", async (c) => {
  const result = await send();

  // return c.json({ ts: body.message.ts });

  return c.json({
    result,
  });
});

export { external };
