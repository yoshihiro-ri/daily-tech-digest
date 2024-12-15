import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";

const external = new Hono();

external.get("/", (c) => c.text("external!"));

// 記事のクロール
external.get("/scrape", async (c) => {
  const result = await scrape();
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
