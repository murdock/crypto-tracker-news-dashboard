import { PrismaClient } from "@prisma/client";
import { db } from "../prisma.config";

const prisma = new PrismaClient({ adapter: db });

async function main() {
  console.log("Resetting tables...");

  await prisma.cryptoPrice.deleteMany();
  await prisma.cryptoAsset.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subscriber.deleteMany();

  // --- SYSTEM USER ---
  console.log("Creating System user...");
  const systemUser = await prisma.user.upsert({
    where: { email: "system@yourapp.com" },
    update: {},
    create: { name: "System", email: "system@yourapp.com" },
  });

  // --- REGULAR USERS ---
  console.log("Seeding regular users...");
  const users = await Promise.all(
    Array.from({ length: 50 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        },
      })
    )
  );

  // --- CRYPTO ASSETS ---
  console.log("Seeding crypto assets...");
  const majorAssets = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" },
    { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "DOT", name: "Polkadot" },
    { symbol: "LTC", name: "Litecoin" },
  ] as const;

  const assets = await Promise.all(
    majorAssets.map((a) =>
      prisma.cryptoAsset.create({ data: { symbol: a.symbol, name: a.name } })
    )
  );

  // --- CRYPTO PRICES ---
  console.log("Seeding crypto prices...");
  await Promise.all(
    assets.map((asset) =>
      prisma.cryptoPrice.create({
        data: {
          asset: { connect: { id: asset.id } },
          priceUsd: Number((Math.random() * (80000 - 300) + 300).toFixed(2)),
          source: "seed",
        },
      })
    )
  );

  // --- SAMPLE CRYPTO NEWS ---
  console.log("Seeding crypto news posts...");
  const sampleNews = [
    {
      title: "Bitcoin hits new all-time high",
      content: "Bitcoin has surged past $80,000 amid market excitement.",
      category: "Crypto",
    },
    {
      title: "Ethereum 2.0 upgrade scheduled",
      content: "Ethereum plans its next upgrade to improve scalability and fees.",
      category: "Crypto",
    },
    {
      title: "Solana network suffers downtime",
      content: "Solana experiences temporary outage due to network congestion.",
      category: "Crypto",
    },
  ];

  for (const article of sampleNews) {
    const exists = await prisma.post.findUnique({
      where: { title: article.title },
    });

    if (!exists) {
      await prisma.post.create({
        data: {
          title: article.title,
          content: article.content,
          category: article.category,
          published: true,
          views: 0,
          authorId: systemUser.id,
          createdAt: new Date(),
        },
      });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
