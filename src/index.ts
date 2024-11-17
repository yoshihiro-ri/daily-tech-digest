import { Hono } from "hono";
import { send } from "./send";
import { scrape } from "./scrape";
const app = new Hono();

app.get("/", async (c) => {
  const result = await send();
  console.log("===================");
  console.log(result);
  return c.json(result)
});

app.get("/scrape", async (c) => {
  const result = await scrape()
  console.log(result);
  return c.json(result)
});



app.fire();

export default app;
