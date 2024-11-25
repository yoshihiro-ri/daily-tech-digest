import { CHANNEL_TOKEN } from "../env";
import { LINE_LINK } from "../env";

import { scrape } from "./scrape";
export const send = async (): Promise<number> => {
  const  articles = await scrape()
  const  article = articles[0]

  const response = await fetch(LINE_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHANNEL_TOKEN}`
    },
    body: JSON.stringify({
      messages: [
        {
          type: "text",
          text: `${article.title}   \n❤️${article.iine} \n${article.link}`,
        }
      ],
    }),
  });
  return await response.status;
}