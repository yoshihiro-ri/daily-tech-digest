import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";
const app = new Hono();

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
