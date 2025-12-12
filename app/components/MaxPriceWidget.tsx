// app/components/MaxPriceWidget.tsx
import { prisma } from "@/lib/db";

type MaxPrice = {
  symbol: string;
  priceUsd: number;
};

type Props = {
  symbols?: string[];
};

export default async function MaxPriceWidget({ symbols }: Props) {
  const selectedSymbols = symbols?.map((s) => s.toUpperCase()) || ["BTC", "ETH", "SOL", "BNB", "XRP"];

  const prices: MaxPrice[] = await Promise.all(
    selectedSymbols.map(async (symbol) => {
      const asset = await prisma.cryptoAsset.findUnique({ where: { symbol } });
      if (!asset) return { symbol, priceUsd: 0 };

      const agg = await prisma.cryptoPrice.aggregate({
        where: { assetId: asset.id },
        _max: { priceUsd: true },
      });

      return { symbol, priceUsd: agg._max.priceUsd ?? 0 };
    })
  );

  return (
    <div className="bg-white dark:bg-amber-700 p-6 rounded-xl shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-white">Max Detected Prices</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {prices.map(({ symbol, priceUsd }) => (
          <div key={symbol} className="p-4 bg-gray-50 dark:bg-amber-400 rounded shadow">
            <span className="block font-medium text-white">{symbol}</span>
            <span className="text-xl font-bold text-white">${priceUsd.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
