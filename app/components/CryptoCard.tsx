export function CryptoCard({ symbol, price }: { symbol: string; price: number }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="text-xl font-semibold">{symbol.toUpperCase()}</div>
      <div className="text-2xl font-bold mt-2">${price.toFixed(2)}</div>
    </div>
  );
}
