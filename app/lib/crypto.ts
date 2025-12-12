// app/lib/crypto.ts
import { prisma } from "./db";

export async function getLatestCryptoPrices() {
  const latestPrices = await prisma.cryptoPrice.findMany({
    orderBy: { createdAt: "desc" },
    distinct: ["assetId"],
    select: {
      priceUsd: true,
      asset: { select: { symbol: true } },
    },
  });

  return latestPrices.map(p => ({
    symbol: p.asset.symbol,
    priceUsd: p.priceUsd,
  }));
}
