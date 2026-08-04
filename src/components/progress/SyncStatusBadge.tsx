"use client";

import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { useUserId } from "@/hooks/use-user-id";
import { useSyncProgress } from "@/queries/progress";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

function GuestSyncStatusBadge() {
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  if (!online) {
    return (
      <Badge variant="outline" className="gap-1">
        <CloudOff className="h-3 w-3" />
        Офлайн
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      Гость
    </Badge>
  );
}

/** Full session-aware badge — mounted only when AUTH_ENABLED is true. */
function AuthenticatedSyncStatusBadge() {
  const { data: session } = useSession();
  const userId = useUserId();
  const syncProgress = useSyncProgress(userId);
  const hasSyncedRef = useRef(false);
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  useEffect(() => {
    if (!session?.user?.id || !online || hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;
    syncProgress.mutate();
  }, [session?.user?.id, online, syncProgress]);

  if (!online) {
    return (
      <Badge variant="outline" className="gap-1">
        <CloudOff className="h-3 w-3" />
        Офлайн
      </Badge>
    );
  }

  if (syncProgress.isPending) {
    return (
      <Badge variant="outline" className="gap-1">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Синхронизация
      </Badge>
    );
  }

  if (session?.user?.id) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Cloud className="h-3 w-3" />
        Синхронизировано
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      Гость
    </Badge>
  );
}

export function SyncStatusBadge() {
  if (!AUTH_ENABLED) {
    return <GuestSyncStatusBadge />;
  }

  return <AuthenticatedSyncStatusBadge />;
}
