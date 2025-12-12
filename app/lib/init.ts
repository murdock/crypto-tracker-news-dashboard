// app/lib/init.ts
import { scheduleCryptoNewsFetch } from "./cron";
import { startBinancePriceWS } from "./cryptoPrices";
import { prisma } from "./db";

scheduleCryptoNewsFetch(); // cron for crypto news

// Start real-time Binance price WS
(async () => {
  const assets = await prisma.cryptoAsset.findMany();
  const symbols = assets.map((a) => a.symbol);
  startBinancePriceWS(symbols);
})();
