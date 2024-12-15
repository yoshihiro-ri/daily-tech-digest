import { BOT_OAUTH_TOKEN } from "../../../env";
import { SLACK_LINK } from "../../../env";
import { CHANNEL_ID } from "../../../env";
import { ZENN_LINK } from "../../../env";

import { scrape } from "./scrape";

export const send = async (): Promise<Response> => {
  const articles = await scrape();
  const article = articles[0];
  const params = new URLSearchParams();
  params.append("channel", CHANNEL_ID);
  params.append("text", `${ZENN_LINK + article.link}`);

  const response = await fetch(SLACK_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${BOT_OAUTH_TOKEN}`,
    },
    body: params,
  });

  return await response;
};
