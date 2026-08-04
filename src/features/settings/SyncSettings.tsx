"use client";

import { AUTH_ENABLED } from "@/data/auth/flags";
import { useUserId } from "@/hooks/use-user-id";
import { useSyncProgress } from "@/queries/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SyncStatusBadge } from "@/components/progress/SyncStatusBadge";

export function SyncSettings() {
  const userId = useUserId();
  const sync = useSyncProgress(userId);

  if (!AUTH_ENABLED) {
    return null;
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title text-base">Синхронизация</h2>
        <SyncStatusBadge />
      </div>
      <p className="text-body text-text-secondary">
        Между устройствами синхронизируются пройденные уроки, статусы и оценки.
        XP, серии, награды и интервалы повторения пока хранятся только на этом
        устройстве.
      </p>
      <Button
        variant="outline"
        disabled={sync.isPending || !userId || userId.startsWith("guest-")}
        onClick={() => sync.mutate()}
      >
        {sync.isPending ? "Синхронизация…" : "Синхронизировать сейчас"}
      </Button>
      {sync.isError ? (
        <p className="text-sm text-destructive">
          Не удалось синхронизировать. Проверьте сеть и вход в аккаунт.
        </p>
      ) : null}
      {sync.isSuccess ? (
        <p className="text-sm text-text-secondary">Прогресс обновлён.</p>
      ) : null}
    </Card>
  );
}
