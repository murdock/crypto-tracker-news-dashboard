// app/api/dashboard-stats/route.ts
import { prisma } from "@/lib/db";

export async function GET() {

  const prices = await prisma.cryptoPrice.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { asset: { select: { symbol: true } } },
  });

  const data: Record<string, any>[] = [];
  const lastPrice: Record<string, number> = {}; // keep track of last known price per symbol

  prices.reverse().forEach((p) => {
    const ts = p.createdAt.toISOString();
    let point = data.find((d) => d.timestamp === ts);
    if (!point) {
      point = { timestamp: ts };
      data.push(point);
    }

    const symbol = p.asset.symbol.toUpperCase();
    lastPrice[symbol] = p.priceUsd;

    // Fill all symbols at this timestamp with last known price
    Object.keys(lastPrice).forEach((sym) => {
      point[sym] = lastPrice[sym];
    });
  });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
