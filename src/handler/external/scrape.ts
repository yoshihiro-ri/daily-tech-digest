import { articles } from "../../../schema";
import * as cheerio from "cheerio";
import { ZENN_LINK } from "../../../env";
import { DrizzleD1Database } from "drizzle-orm/d1";

class ZennArticle {
  posted_at: string;
  title: string;
  url: string;

  constructor({
    posted_at,
    title,
    url,
  }: {
    posted_at: string;
    title: string;
    url: string;
  }) {
    this.posted_at = posted_at;
    this.title = title;
    this.url = url;
  }
}

class ZennArticles {
  articles: ZennArticle[];

  constructor() {
    this.articles = [];
  }

  addArticle(article: ZennArticle) {
    this.articles.push(article);
  }

  getArticles() {
    return this.articles;
  }
}

export async function scrape(
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  }
) {
  const articles = new ZennArticles();

  const $ = await fetchArticles();

  const elements = $(
    "#tech-trend .ArticleList_listContainer__m2qg0 .ArticleList_content__a7csX"
  );

  const savedArticleTitles = await getSavedArticleTitles(db);

  elements.each((index, element) => {
    const posted_at = $(element).find("time").attr("datetime");
    const title = $(element).find("h2").text();
    const url = $(element).find("a").attr("href");

    if (savedArticleTitles.includes(title)) {
      return;
    }

    const article = new ZennArticle({
      posted_at: posted_at ?? "",
      title: title,
      url: ZENN_LINK + url ?? "",
    });

    save(db, article);

    articles.addArticle(article);
  });
  return articles.getArticles();
}

const fetchArticles = async () => {
  const $ = cheerio.load(
    await fetch(ZENN_LINK, {
      headers: {
        "user-agent": "bot",
      },
    }).then((res) => res.text())
  );
  return $;
};

const save = async (
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  },
  article: ZennArticle
) => {
  const result = await db.insert(articles).values({
    title: article.title,
    url: article.url,
    posted_at: article.posted_at,
  });
  return result;
};

const getSavedArticleTitles = async (
  db: DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
  }
) => {
  const result = await db
    .select({
      title: articles.title,
    })
    .from(articles);

  const titles = result.map((item) => item.title);
  return titles;
};
