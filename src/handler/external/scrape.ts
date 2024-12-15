import * as cheerio from "cheerio";
import { ZENN_LINK } from "../../../env";
import { DAILY_SAVE_ARTICLE_LIMIT } from "../../../env";

export async function scrape() {
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

  const save = async (article: ZennArticle) => {
    await fetch("http://127.0.0.1:8787/crud/article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    }).then((res) => res.text());
  };

  const articles = new ZennArticles();

  const $ = cheerio.load(
    await fetch(ZENN_LINK, {
      headers: {
        "user-agent": "bot",
      },
    }).then((res) => res.text())
  );

  const elements = $(
    "#tech-trend .ArticleList_listContainer__m2qg0 .ArticleList_content__a7csX"
  );

  elements.each((index, element) => {
    if (index >= DAILY_SAVE_ARTICLE_LIMIT) {
      return false; // ループを終了する
    }
    const posted_at = $(element).find("time").attr("datetime");
    const title = $(element).find("h2").text();
    const url = $(element).find("a").attr("href");

    const article = new ZennArticle({
      posted_at: posted_at ?? "",
      title: title,
      url: ZENN_LINK + url ?? "",
    });

    save(article);

    articles.addArticle(article);
  });

  return articles.getArticles();
}
