import { BOT_OAUTH_TOKEN } from "../../../env";
import { SLACK_LINK } from "../../../env";
import { CHANNEL_ID } from "../../../env";
import { DAILY_SEND_ARTICLE_LIMIT } from "../../../env";

type article = {
  posted_at: string;
  title: string;
  url: string;
};

export const send = async (): Promise<any> => {
  const send_main_message_result = await send_main_message();
  const body = await send_main_message_result.json();
  const today_articles: article[] = await articles();
  console.log(today_articles);

  for (const article of today_articles) {
    console.log(article);
    await send_thread_message(body.ts, article);
  }

  return today_articles;
};

const send_main_message = async (): Promise<Response> => {
  const params = new URLSearchParams();
  params.append("channel", CHANNEL_ID);
  params.append("text", "今日のトレンド記事 from Zenn");

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

const send_thread_message = async (
  thread_ts: string,
  article: article
): Promise<Response> => {
  const params = new URLSearchParams();
  params.append("channel", CHANNEL_ID);
  params.append("thread_ts", thread_ts);
  params.append("text", `${article.url}`);
  params.append("unfurl_links", true);
  params.append("unfurl_media", "true");

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

const articles = async (): Promise<article[]> => {
  const result = await fetch(
    `http://127.0.0.1:8787/crud/article?limit=${DAILY_SEND_ARTICLE_LIMIT}`,
    {
      method: "GET",
    }
  );
  return result.json();
};
