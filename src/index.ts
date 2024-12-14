import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";
import { users } from "../schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("Hono!"));

app.get("/scrape", async (c) => {
  const result = await scrape();
  console.log(result);
  return c.json(result);
});

app.get("/send", async (c) => {
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

import { crud_users } from "./users";
app.route("/crud_users", crud_users);

// const waitSend = async () => {
//   const result = await send();
//   console.log(result); // 結果をログに出力
// }

// const scheduled: ExportedHandlerScheduledHandler = async (event, env, ctx) => {
//   ctx.waitUntil(waitSend())
// }

// export default {
//   fetch: app.fetch,
//   scheduled,
// }

app.fire();

export default app;
