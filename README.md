# SSR/ISR Crypto Dashboard Demo

This project demonstrates a **Next.js 16 app** with SSR, ISR, real-time crypto prices, cron tasks, and safe HTML rendering. It uses Prisma for database operations and provides a fully functional dashboard and posts widget.

---

## Project Structure

```
.
├── app
│   ├── api
│   │   ├── dashboard-stats/route.ts
│   │   ├── posts/route.ts
│   │   └── subscribe/route.ts
│   ├── components
│   │   ├── Breadcrumbs.tsx
│   │   ├── CryptoCard.tsx
│   │   ├── CryptoChart.tsx
│   │   ├── HTMLRenderer.tsx
│   │   ├── Pagination.tsx
│   │   ├── PostCard.tsx
│   │   ├── RealtimePrices.tsx
│   │   ├── RecentPostsWidget.tsx
│   │   └── SubscribeForm.tsx
│   ├── dashboard/page.tsx
│   ├── page.tsx
│   ├── posts/[id]/page.tsx
│   ├── posts/page/[page]/page.tsx
│   └── subscribe/page.tsx
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
├── app/lib
│   ├── cron.ts
│   ├── crypto.ts
│   ├── cryptoNews.ts
│   ├── cryptoPrices.ts
│   ├── db.ts
│   ├── init.ts
│   └── saveCryptoPrices.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Features

* **SSR/ISR Home Page** with a mini crypto price widget.
* **Real-time prices** via WebSockets (`RealtimePrices` component).
* **Price History Chart** (`CryptoChart`) using Recharts.
* **Cron Tasks**: fetches crypto news every hour and stores in DB.
* **Safe HTML Rendering** in posts without `dangerouslySetInnerHTML`.

---

## API Endpoints

### `/api/dashboard-stats` (GET)

Returns historical crypto prices for charting.

```json
[
  { "timestamp": "2025-12-12T12:00:00.000Z", "BTC": 34000, "ETH": 2400, "SOL": 34 },
  { "timestamp": "2025-12-12T12:01:00.000Z", "BTC": 34010, "ETH": 2405, "SOL": 34.2 }
]
```

### `/api/posts` (GET)

Returns latest posts for ISR widgets.

```json
[
  { "id": 688, "title": "Bitcoin hits new high" },
  { "id": 687, "title": "Ethereum upgrade announced" }
]
```

### `/api/subscribe` (POST)

Accepts `{ email: string }` to subscribe a user (to use in full - email client implementation is required).

Request:

```json
{ "email": "user@example.com" }
```

Response:

```json
{ "message": "Subscribed successfully", "subscriber": { "id": 12, "email": "user@example.com" } }
```

---

## Architecture Diagram

```
       +----------------------+
       |   Next.js 16 App     |
       +----------+-----------+
                  |
        SSR Home Page + ISR Widgets
                  |
     +------------+-------------+
     |                          |
 RealtimePrices                 RecentPostsWidget
  (WebSocket)                        (API Fetch)
     |                                  |
 Binance WS --------------------> /api/posts
     |
 Prisma DB <-------------------- Cron (news & price)
```

---

## Notes

* **WebSockets**: `RealtimePrices` subscribes to Binance streams for live price updates.
* **Cron tasks**: use `node-cron` in `app/lib/cron.ts` to fetch crypto news.
* **Database**: Prisma handles users, subscribers, posts, assets, and prices.
* **HTML rendering**: `HTMLRenderer` converts HTML strings to React elements safely, avoiding hydration errors.

---

## Run Instructions

```bash
# Install dependencies
pnpm install

# Seed DB
pnpm prisma db seed
pnpm prisma generate

# Create migration

pnpm prisma migrate dev --name ```<migration name>```

# Reset migrations

pnpm prisma migrate reset

# Run dev server
pnpm dev

# Build and start
pnpm build
pnpm start
```

This setup demonstrates a fully functional SSR + ISR app with real-time updates, cron jobs, and safe content rendering.
