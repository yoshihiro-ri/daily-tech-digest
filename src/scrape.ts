import * as cheerio from "cheerio";
import { QIITA_LINK } from "../env";

export async function scrape() {
  class QiitaArticle {
    date: string;
    author: string;
    title: string;
    tags: string[];
    iine: number;
    link: string;

    constructor({
      date,
      author,
      title,
      tags,
      iine,
      link,
    }: {
      date: string;
      author: string;
      title: string;
      tags: string[];
      iine: number;
      link: string;
    }) {
      this.date = date;
      this.author = author;
      this.title = title;
      this.tags = tags;
      this.iine = iine;
      this.link = link;
    }
  }

  class QiitaArticles {
    articles: QiitaArticle[];

    constructor() {
      this.articles = [];
    }

    addArticle(article: QiitaArticle) {
      this.articles.push(article);
    }

    getArticles() {
      return this.articles;
    }
  }
  const articles = new QiitaArticles();
  const $ = cheerio.load(
    await fetch(QIITA_LINK, {
      headers: {
        "user-agent": "bot",
      },
    }).then((res) => res.text())
  );
  const elements = $(".style-1p44k52").find("article");
  elements.each((index, element) => {
    const header = $(element).find("header");
    const date = $(header).find("time").text();
    const author = $(header).find("p").text();
    const title = $(element).find("h2 > a").text();
    const link = String($(element).find("h2 > a").attr("href"));
    const footer = $(element).find("footer");
    const tags = $(footer).find("li");
    const tagTexts: string[] = [];
    tags.each((index, tag) => {
      tagTexts.push($(tag).text());
    });

    const iine = Number($(footer).find("span").text());

    const article = new QiitaArticle({
      date: date,
      author: author,
      title: title,
      tags: tagTexts,
      iine: iine,
      link: link,
    });
    articles.addArticle(article);
  });
  return articles.getArticles()
}
