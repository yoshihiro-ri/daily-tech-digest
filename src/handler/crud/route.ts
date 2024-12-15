import { Hono } from "hono";
import { user } from "./user";
const crud = new Hono();

crud.get("/", (c) => c.text("crud!"));
crud.route("/user", user);
export { crud };
