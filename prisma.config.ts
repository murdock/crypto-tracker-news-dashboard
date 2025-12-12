import 'dotenv/config'; // automatically loads .env
import { defineConfig } from "prisma/config";
import { fileURLToPath } from "url";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = new PrismaPg(pool);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not defined");

export default defineConfig({
  schema: path.join(path.dirname(fileURLToPath(import.meta.url)), "prisma/schema.prisma"),
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "pnpm tsx prisma/seed.ts",
  },
});
