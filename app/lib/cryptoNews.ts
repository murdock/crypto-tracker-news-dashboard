// app/lib/cryptoNews.ts
import Parser from "rss-parser";
import { prisma } from "./db";

const parser = new Parser();

const RSS_FEEDS = [
  "https://cryptonews.com/news/feed",
  "https://www.coindesk.com/arc/outboundfeeds/rss/",
  "https://cointelegraph.com/rss",
];

export type NewsItem = {
  title: string;
  content: string;
  url?: string;
};

export async function fetchCryptoNews(): Promise<NewsItem[]> {
  const systemUser = await prisma.user.findUnique({
    where: { email: "system@yourapp.com" }, // email for tests
  });

  if (!systemUser) {
    throw new Error("System user not found. Did you seed the database?");
  }

  const newPosts: NewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    const feedData = await parser.parseURL(feed);
    for (const item of feedData.items) {
      if (!item.title || !item.content) continue;

      // Avoid duplicates in DB
      const exists = await prisma.post.findUnique({
        where: { title: item.title },
      });
      if (exists) continue;

      newPosts.push({
        title: item.title,
        content: item.content,
        url: item.link,
      });
    }
  }

  return newPosts;
}
