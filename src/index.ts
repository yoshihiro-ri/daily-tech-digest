import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("Hono!"));

import { crud } from "./handler/crud/route";
app.route("/crud", crud);

import { external } from "./handler/external/route";
app.route("/external", external);

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
