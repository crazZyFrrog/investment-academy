import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let db: Db | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  if (!db) {
    // HTTP driver is more reliable with Neon free-tier cold starts
    // than a long-lived TCP connection (postgres.js / ECONNRESET).
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  }

  return db;
}

export type DbClient = NonNullable<ReturnType<typeof getDb>>;
