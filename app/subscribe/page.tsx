"use client";

import { useState } from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setStatus(`Subscribed: ${data.subscriber.email}`);
    } catch (err: any) {
      setStatus(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Subscribe</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Subscribe
        </button>
      </form>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
