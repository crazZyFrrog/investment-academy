import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/data/db/client";
import * as schema from "@/data/db/schema";
import { getEnv } from "@/lib/env";

export const runtime = "nodejs";

const eventSchema = z.object({
  userId: z.string().uuid(),
  entitlement: z.string().min(1).max(100),
  source: z.enum(["stripe", "apple", "google", "revenuecat"]),
  expiresAt: z.string().datetime().nullable().optional(),
});

function validSignature(payload: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = Buffer.from(signature, "hex");
  const actual = Buffer.from(expected, "hex");
  return provided.length === actual.length && timingSafeEqual(provided, actual);
}

export async function POST(request: Request) {
  const secret = getEnv().BILLING_WEBHOOK_SECRET;
  const signature = request.headers.get("x-billing-signature");
  const payload = await request.text();

  if (!secret || !signature || !validSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid billing event" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  const db = getDb();
  if (!parsed.success || !db) {
    return NextResponse.json({ error: "Invalid billing event" }, { status: 400 });
  }

  await db.insert(schema.entitlements).values({
    userId: parsed.data.userId,
    key: parsed.data.entitlement,
    source: parsed.data.source,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
  });

  return NextResponse.json({ ok: true });
}
