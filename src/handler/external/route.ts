import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";

const external = new Hono();

external.get("/", (c) => c.text("external!"));

// 記事のクロール
external.get("/scrape", async (c) => {
  const result = await scrape();
  console.log(result);
  return c.json(result);
});

// 記事の配信
external.get("/send", async (c) => {
  const result = await send();
  const body = await result.json();

  return c.json({
    status: result.status,
    statusText: result.statusText,
    headers: [...result.headers.entries()], // Headers オブジェクトを配列に変換
    ok: result.ok,
    redirected: result.redirected,
    body: body,
  });
});

export { external };
