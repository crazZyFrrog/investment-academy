import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/data/db/client";

export async function GET() {
  const db = getDb();
  let database: "ok" | "unavailable" | "skipped" = "skipped";

  if (db) {
    try {
      await db.execute(sql`select 1`);
      database = "ok";
    } catch {
      database = "unavailable";
    }
  }

  const ok = database !== "unavailable";

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      service: "investment-academy",
      database,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
