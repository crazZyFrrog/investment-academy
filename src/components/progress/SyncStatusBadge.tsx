"use client";

import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { useUserId } from "@/hooks/use-user-id";
import { useSyncProgress } from "@/queries/progress";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff } from "@/design-system/icons";
import { cn } from "@/lib/utils";

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

type SyncStatusBadgeProps = {
  /** Icon-only for tight layouts (sidebar / mobile header). */
  compact?: boolean;
  className?: string;
};

function GuestSyncStatusBadge({ compact, className }: SyncStatusBadgeProps) {
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  if (!online) {
    return (
      <Badge
        variant="outline"
        title="Офлайн"
        className={cn(compact ? "px-1.5" : "gap-1", className)}
      >
        <CloudOff className="size-3" aria-hidden />
        {compact ? <span className="sr-only">Офлайн</span> : "Офлайн"}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      title="Гость"
      className={cn(compact ? "px-1.5" : "gap-1", className)}
    >
      {compact ? <span className="sr-only">Гость</span> : "Гость"}
    </Badge>
  );
}

/** Full session-aware badge — mounted only when AUTH_ENABLED is true. */
function AuthenticatedSyncStatusBadge({
  compact,
  className,
}: SyncStatusBadgeProps) {
  const { data: session } = useSession();
  const userId = useUserId();
  const { mutate } = useSyncProgress(userId);
  const hasSyncedRef = useRef(false);
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  // Background sync once per mount — do not drive a spinning icon from this.
  useEffect(() => {
    if (!session?.user?.id || !online || hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;
    mutate();
  }, [session?.user?.id, online, mutate]);

  if (!online) {
    return (
      <Badge
        variant="outline"
        title="Офлайн"
        className={cn(compact ? "px-1.5" : "gap-1", className)}
      >
        <CloudOff className="size-3" aria-hidden />
        {compact ? <span className="sr-only">Офлайн</span> : "Офлайн"}
      </Badge>
    );
  }

  if (session?.user?.id) {
    return (
      <Badge
        variant="secondary"
        title="Синхронизировано"
        className={cn(compact ? "px-1.5" : "gap-1", className)}
      >
        <Cloud className="size-3" aria-hidden />
        {compact ? (
          <span className="sr-only">Синхронизировано</span>
        ) : (
          "Синхронизировано"
        )}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      title="Гость"
      className={cn(compact ? "px-1.5" : "gap-1", className)}
    >
      {compact ? <span className="sr-only">Гость</span> : "Гость"}
    </Badge>
  );
}

export function SyncStatusBadge({
  compact = false,
  className,
}: SyncStatusBadgeProps) {
  if (!AUTH_ENABLED) {
    return <GuestSyncStatusBadge compact={compact} className={className} />;
  }

  return (
    <AuthenticatedSyncStatusBadge compact={compact} className={className} />
  );
}
