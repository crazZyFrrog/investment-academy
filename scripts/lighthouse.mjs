#!/usr/bin/env node
/**
 * Lightweight Lighthouse audit for local polish checks.
 * Requires a running production server: `npm run build && npm run start`
 * or pass BASE_URL.
 *
 * Usage: npm run lighthouse
 */
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const OUT_DIR = path.join(process.cwd(), ".lighthouse");

const ROUTES = ["/", "/dashboard", "/courses", "/progress"];

const THRESHOLDS = {
  performance: 0.55,
  accessibility: 0.9,
  "best-practices": 0.85,
  seo: 0.9,
};

async function run() {
  let lighthouse;
  try {
    lighthouse = (await import("lighthouse")).default;
  } catch {
    console.error("Install lighthouse: npm i -D lighthouse chrome-launcher");
    process.exit(1);
  }
  const chromeLauncher = await import("chrome-launcher");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  const summary = [];
  let failed = false;

  try {
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      console.log(`\n→ Auditing ${url}`);
      const result = await lighthouse(url, {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          disabled: false,
        },
      });

      if (!result) {
        throw new Error(`No Lighthouse result for ${url}`);
      }

      const slug =
        route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
      const fileBase = path.join(OUT_DIR, slug || "home");
      const reports = Array.isArray(result.report)
        ? result.report
        : [result.report];
      fs.writeFileSync(`${fileBase}.report.json`, reports[0]);
      if (reports[1]) {
        fs.writeFileSync(`${fileBase}.report.html`, reports[1]);
      }

      const scores = {};
      for (const [key, category] of Object.entries(result.lhr.categories)) {
        scores[key] = category.score ?? 0;
        const threshold = THRESHOLDS[key];
        const ok = threshold == null || scores[key] >= threshold;
        const label = `${key}: ${(scores[key] * 100).toFixed(0)} (min ${Math.round((threshold ?? 0) * 100)})`;
        console.log(ok ? `  ✓ ${label}` : `  ✗ ${label}`);
        if (!ok) failed = true;
      }
      summary.push({ route, scores });
    }
  } finally {
    try {
      await chrome.kill();
    } catch {
      // Windows often throws EPERM while cleaning Chrome's temp profile.
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2)
  );
  console.log(`\nReports saved to ${OUT_DIR}`);
  if (failed) {
    console.error("\nSome Lighthouse thresholds failed.");
    process.exit(1);
  }
  console.log("\nAll Lighthouse thresholds passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
