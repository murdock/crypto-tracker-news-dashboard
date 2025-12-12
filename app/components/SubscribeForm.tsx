"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      alert(data.message);
      setEmail("");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
      <label htmlFor="email" className="block text-gray-700 font-medium">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="you@example.com"
      />
      <button
        type="submit"
        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        Subscribe
      </button>
    </form>
  );
}
