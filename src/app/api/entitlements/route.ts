import { NextResponse } from "next/server";
import { auth } from "@/data/auth/config";
import { hasEntitlement } from "@/data/billing/entitlements";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    premium: await hasEntitlement(userId, "premium"),
  });
}
