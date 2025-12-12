// app/lib/saveCryptoPrices.ts
import { prisma } from "./db";

export async function saveCryptoPrices(prices: { symbol: string; priceUsd: number }[]) {
  for (const { symbol, priceUsd } of prices) {
    const asset = await prisma.cryptoAsset.findUnique({ where: { symbol } });
    if (!asset) continue;

    await prisma.cryptoPrice.create({
      data: {
        priceUsd,
        assetId: asset.id,
        source: "binance",
      },
    });
  }
}
