import { and, eq, gt, isNull, or } from "drizzle-orm";
import { getDb } from "@/data/db/client";
import * as schema from "@/data/db/schema";

export async function hasEntitlement(userId: string, key: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const now = new Date();
  const rows = await db
    .select({ id: schema.entitlements.id })
    .from(schema.entitlements)
    .where(
      and(
        eq(schema.entitlements.userId, userId),
        eq(schema.entitlements.key, key),
        or(isNull(schema.entitlements.expiresAt), gt(schema.entitlements.expiresAt, now))
      )
    )
    .limit(1);

  return rows.length > 0;
}
