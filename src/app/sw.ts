import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "serwist";
import { Serwist } from "serwist";

interface ServiceWorkerSelf {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  skipWaiting: () => void;
}

interface ServiceWorkerFetchEvent extends Event {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

const swSelf = self as unknown as ServiceWorkerSelf;

const serwist = new Serwist({
  precacheEntries: swSelf.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

addEventListener("fetch", (event) => {
  const fetchEvent = event as ServiceWorkerFetchEvent;
  const pathname = new URL(fetchEvent.request.url).pathname;
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/billing") ||
    pathname.startsWith("/api/entitlements") ||
    pathname.startsWith("/api/progress")
  ) {
    fetchEvent.respondWith(fetch(fetchEvent.request));
  }
});

serwist.addEventListeners();
