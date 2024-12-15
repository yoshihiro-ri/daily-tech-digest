import { Hono } from "hono";
import { user } from "./user";
import { article } from "./article";
const crud = new Hono();

crud.get("/", (c) => c.text("crud!"));

crud.route("/user", user);
crud.route("/article", article);

export { crud };
