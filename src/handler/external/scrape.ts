import * as cheerio from "cheerio";
import { ZENN_LINK } from "../../../env";

export async function scrape() {
  class ZennArticle {
    date: string;
    title: string;
    link: string;

    constructor({
      date,
      title,
      link,
    }: {
      date: string;
      title: string;
      link: string;
    }) {
      this.date = date;
      this.title = title;
      this.link = link;
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
    const date = $(element).find("time").attr("datetime");
    const title = $(element).find("h2").text();
    const link = $(element).find("a").attr("href");

    const article = new ZennArticle({
      date: date ?? "",
      title: title,
      link: link ?? "",
    });
    articles.addArticle(article);
  });
  return articles.getArticles();
}
