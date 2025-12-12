// app/components/RealtimePrices.tsx
"use client";

import { useEffect, useState } from "react";
import { CryptoCard } from "./CryptoCard";

const WS_URL = "wss://stream.binance.com:9443/stream?streams=";

interface RealtimePricesProps {
  initial: { symbol: string; priceUsd: number }[];
}

export default function RealtimePrices({ initial }: RealtimePricesProps) {
  const initialMap = initial.reduce<Record<string, number>>((acc, p) => {
    acc[p.symbol.toLowerCase()] = p.priceUsd;
    return acc;
  }, {});

  const [prices, setPrices] = useState(initialMap);

  useEffect(() => {
    const symbols = Object.keys(initialMap);

    if (!symbols.length) return;

    // Binance combined stream URL
    const streams = symbols
      .map((s) => `${s.toLowerCase()}usdt@ticker`)
      .join("/");
    const ws = new WebSocket(`${WS_URL}${streams}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (!msg.data) return;

      const symbol = msg.data.s.replace("USDT", "").toLowerCase();
      const price = parseFloat(msg.data.c);

      setPrices((prev) => ({ ...prev, [symbol]: price }));
    };

    return () => ws.close();
  }, [initialMap]);

  return (
    <div className="mx-auto flex flex-col gap-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-100">
      <h2 className="text-2xl font-semibold mb-4 text-slate-400">
        Realtime Prices
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(prices).map(([sym, price]) => (
          <CryptoCard key={sym} symbol={sym} price={price} />
        ))}
      </div>
    </div>
  );
}
