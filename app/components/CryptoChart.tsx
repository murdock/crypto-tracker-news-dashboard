"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

type PricePoint = Record<string, number | string>;
const INTERVAL = 30000;
const COLORS = [
  "#f7931a", "#627eea", "#00fffc", "#ff0000", "#00ff00",
  "#ff00ff", "#ffa500", "#8a2be2", "#a52a2a", "#008000",
];

const ALL_SYMBOLS = ["ADA","BNB","BTC","SOL","ETH","XRP","DOGE","DOT","LTC"];

export default function CryptoChart() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [visibleSymbols, setVisibleSymbols] = useState<string[]>(ALL_SYMBOLS);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard-stats");
      const json: PricePoint[] = await res.json();
      setData(json);
    }

    fetchData();
    const interval = setInterval(fetchData, INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const toggleSymbol = (symbol: string) => {
    setVisibleSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div className={"mx-auto flex flex-col gap-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800"}>
      <div className="flex flex-row items-center justify-center gap-2 bg-white gap-y-4 rounded-xl">
        {ALL_SYMBOLS.map((symbol) => (
          <label key={symbol} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={visibleSymbols.includes(symbol)}
              onChange={() => toggleSymbol(symbol)}
            />
            {symbol}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => new Date(ts as string).toLocaleTimeString()}
          />
          <YAxis
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDataOverflow
            tickFormatter={(v) => `$${(v as number).toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => (value as number).toLocaleString()}
            labelFormatter={(label) => new Date(label as string).toLocaleString()}
          />
          <Legend />

          {visibleSymbols.map((symbol, i) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              stroke={COLORS[i % COLORS.length]}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          ))}

          <Brush
            dataKey="timestamp"
            height={30}
            stroke="#8884d8"
            travellerWidth={10}
            startIndex={0}
            endIndex={data.length > 20 ? 20 : data.length - 1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
