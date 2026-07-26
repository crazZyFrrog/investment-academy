import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Playwright and local tooling hit 127.0.0.1; allow Next dev assets.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default withSerwist(nextConfig);
