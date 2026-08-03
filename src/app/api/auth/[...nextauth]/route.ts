import { handlers } from "@/data/auth/config";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function disabled() {
  return NextResponse.json({ error: "Authentication is disabled" }, { status: 404 });
}

function limitedPost(request: NextRequest) {
  const result = rateLimit(`auth:${requestIp(request)}`, 20, 60_000);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many authentication attempts" },
      { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } }
    );
  }
  return handlers.POST(request);
}

export const GET = AUTH_ENABLED ? handlers.GET : disabled;
export const POST = AUTH_ENABLED ? limitedPost : disabled;
