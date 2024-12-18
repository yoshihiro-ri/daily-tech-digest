import { BOT_OAUTH_TOKEN } from "../../../env";
import { SLACK_LINK } from "../../../env";
import { CHANNEL_ID } from "../../../env";
import { DAILY_SEND_ARTICLE_LIMIT } from "../../../env";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { articles } from "../../../schema";
import { inArray, eq } from "drizzle-orm";

type article = {
  id: number;
  posted_at: string;
  title: string;
  url: string;
};

export const send = async (
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  }
): Promise<any> => {
  const send_main_message_result = await send_main_message();
  const body = await send_main_message_result.json();
  const unsentArticles: article[] = await getUnsentArticles(db);

  const sentArticleIds = [];

  for (const article of unsentArticles) {
    await send_thread_message(body.ts, article);
    sentArticleIds.push(article.id);
  }

  markArticleAsSent(db, sentArticleIds);

  return unsentArticles;
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

const getUnsentArticles = async (
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  }
): Promise<article[]> => {
  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      posted_at: articles.posted_at,
      url: articles.url,
    })
    .from(articles)
    .where(eq(articles.is_send, false))
    .limit(DAILY_SEND_ARTICLE_LIMIT);

  return result;
};

const markArticleAsSent = async (
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  },
  article_ids: number[]
) => {
  await db
    .update(articles)
    .set({ is_send: true })
    .where(inArray(articles.id, article_ids));
};
