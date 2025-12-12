// app/lib/cron.ts
import cron from "node-cron";
import { fetchCryptoNews } from "./cryptoNews";
import { prisma } from "./db";

// For true “single-instance cron,” a job queue or an external scheduler is needed
export function scheduleCryptoNewsFetch() {
  cron.schedule("0 * * * *", async () => { // every hour
    try {
      const news = await fetchCryptoNews();
      if (news.length === 0) return;

      const systemUser = await prisma.user.findUnique({
        where: { email: "system@yourapp.com" },
      });
      if (!systemUser) throw new Error("System user not found.");

      // Avoid duplicate inserts by checking existing titles in batch
      const titles = news.map((n) => n.title);
      const existing = await prisma.post.findMany({
        where: { title: { in: titles } },
        select: { title: true },
      });
      const existingSet = new Set(existing.map((p) => p.title));

      const toInsert = news
        .filter((n) => !existingSet.has(n.title))
        .map((n) => ({
          title: n.title,
          content: n.content,
          published: true,
          authorId: systemUser.id,
          category: "Crypto",
          sourceUrl: n.url,
        }));

      if (toInsert.length > 0) {
        await prisma.post.createMany({
          data: toInsert,
          skipDuplicates: true,
        });
      }

      // console.log(`[CRON] Inserted ${toInsert.length} new crypto posts.`);
    } catch (err) {
      console.error("[CRON] Failed to fetch crypto news:", err);
    }
  });
}
