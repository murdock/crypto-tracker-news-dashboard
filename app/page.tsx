import Link from "next/link";
import RealtimePrices from "./components/RealtimePrices";
import { getLatestCryptoPrices } from "@/lib/crypto";
import RecentPostsWidget from "./components/RecentPostsWidget";
import MaxPriceWidget from "./components/MaxPriceWidget";

export const revalidate = 600; // 10 minutes

export default async function Home() {
  const initial = await getLatestCryptoPrices();
  const renderTime = new Date().toLocaleTimeString("en-US", { hour12: false });
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <p className="text-xs text-gray-500">
        Page rendered at: {renderTime} (ISR)
      </p>
      <h1 className="text-5xl font-bold text-center mb-6">
        Crypto Dashboard Demo
      </h1>
      <p className="mb-8 text-lg text-gray-700 text-center">
        Live prices for BTC, ETH, SOL and more!
      </p>
      <div className="w-full max-w-3xl mb-8 ">
        <MaxPriceWidget symbols={["BTC","ETH","SOL"]} />
      </div>
      <div className="w-full max-w-3xl mb-8 ">
        <RealtimePrices initial={initial} />
      </div>
      <div className="mb-8 mx-auto flex flex-col gap-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <RecentPostsWidget />
      </div>
      <div className="mx-auto flex flex-col md:flex-row gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Full Dashboard
        </Link>
        <Link
          href="/posts"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Posts
        </Link>
        <Link
          href="/subscribe"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Subscribe
        </Link>
      </div>
    </main>
  );
}
