"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribeOffline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOfflineSnapshot() {
  return !navigator.onLine;
}

function getServerOfflineSnapshot() {
  return false;
}

export function OfflineBanner() {
  const offline = useSyncExternalStore(
    subscribeOffline,
    getOfflineSnapshot,
    getServerOfflineSnapshot
  );

  if (!offline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm text-amber-950">
      <WifiOff className="h-4 w-4" />
      You are offline. Progress is saved locally.
    </div>
  );
}
