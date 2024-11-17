import { CHANNEL_TOKEN } from "../env";
import { scrape } from "./scrape";
export async function send() {
  const  articles = await scrape()
  const  article = articles[0]

  const response = await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHANNEL_TOKEN}`
    },
    body: JSON.stringify({
      messages: [
        {
          type: "text",
          text: `${article.title}`,
        },
        {
          type: "text",
          text: "Hello, world2",
        },
      ],
    }),
  });
  return await response.status;
}