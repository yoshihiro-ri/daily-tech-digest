import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";
const app = new Hono();

app.get("/", async (c) => {

  const result = await send();
  console.log(result);
  console.log("===================");
  return c.json(result)
});

app.get("/scrape", async (c) => {
  const result = await scrape()
  console.log(result);
  return c.json(result)
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
