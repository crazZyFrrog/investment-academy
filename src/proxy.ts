import { NextResponse } from "next/server";
import { auth } from "@/data/auth/config";
import { AUTH_ENABLED } from "@/data/auth/flags";

export default auth((request) => {
  if (!AUTH_ENABLED || request.auth?.user?.id) {
    return NextResponse.next();
  }

  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  if (acceptsHtml) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
});

export const config = {
  matcher: ["/settings/:path*", "/api/entitlements/:path*", "/api/progress/merge"],
};
