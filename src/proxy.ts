import { NextResponse } from "next/server";
import { auth } from "@/data/auth/config";
import { AUTH_ENABLED } from "@/data/auth/flags";

export default auth((request) => {
  if (!AUTH_ENABLED || request.auth?.user?.id) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
});

export const config = {
  matcher: ["/api/entitlements/:path*", "/api/progress/merge"],
};
