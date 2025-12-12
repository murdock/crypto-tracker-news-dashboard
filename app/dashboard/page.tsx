// dashboard
import RealtimePrices from "../components/RealtimePrices";
import CryptoChart from "../components/CryptoChart";
import { getLatestCryptoPrices } from "../lib/crypto";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";

export default async function DashboardPage() {
  const initial = await getLatestCryptoPrices();


  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-6">Crypto Dashboard</h1>
      <Suspense fallback={<div>Loading prices...</div>}>
        <RealtimePrices initial={initial} />
      </Suspense>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Price History</h2>
        <Suspense fallback={<div>Loading chart...</div>}>
          <CryptoChart />
        </Suspense>
      </div>
    </main>
  );
}
