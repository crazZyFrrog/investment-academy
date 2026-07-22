import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "serwist";
import { Serwist } from "serwist";

interface ServiceWorkerSelf {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  skipWaiting: () => void;
}

const swSelf = self as unknown as ServiceWorkerSelf;

const serwist = new Serwist({
  precacheEntries: swSelf.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
