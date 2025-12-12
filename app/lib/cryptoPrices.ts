// app/lib/cryptoPrices.ts
import WebSocket from "ws";
import { prisma } from "./db";

const THROTTLE = 60000;
const WS = "wss://stream.binance.com:9443/stream?streams=";

let ws: WebSocket | null = null;

// keep track of last saved price per symbol
const lastSavedPrice: Record<string, number> = {};
const lastSavedTime: Record<string, number> = {};

export function startBinancePriceWS(symbols: string[]) {
  if (ws) return;
  if (!symbols.length) return console.warn("[Binance WS] No symbols provided");

  const streams = symbols.map((s) => `${s.toLowerCase()}usdt@ticker`).join("/");
  const url = `${WS}${streams}`;

  ws = new WebSocket(url);

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (!msg.data || !msg.data.s || !msg.data.c) return;

      const symbol = msg.data.s.replace("USDT", "").toUpperCase();
      const priceUsd = parseFloat(msg.data.c);

      const now = Date.now();

      // throttle: insert max once per THROTTLE per symbol
      if (lastSavedTime[symbol] && now - lastSavedTime[symbol] < THROTTLE) return;

      // deduplicate: insert only if price changed
      if (lastSavedPrice[symbol] !== undefined && lastSavedPrice[symbol] === priceUsd) return;

      const asset = await prisma.cryptoAsset.findUnique({ where: { symbol } });
      if (!asset) return;

      await prisma.cryptoPrice.create({
        data: {
          assetId: asset.id,
          priceUsd,
          source: "binance",
        },
      });

      lastSavedPrice[symbol] = priceUsd;
      lastSavedTime[symbol] = now;

    } catch (err) {
      console.error("[Binance WS] Failed to process message:", err);
    }
  });

  ws.on("close", () => {
    // console.log("[Binance WS] Connection closed. Reconnecting in 5s...");
    ws = null;
    setTimeout(() => startBinancePriceWS(symbols), 5000);
  });

  ws.on("error", (err) => {
    console.error("[Binance WS] Error:", err);
    ws?.close();
  });
}
