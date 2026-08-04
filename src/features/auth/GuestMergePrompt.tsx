"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGuestMerge } from "./use-guest-merge";

export function GuestMergePrompt() {
  const { open, busy, error, confirmMerge, dismiss } = useGuestMerge();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 px-4 lg:bottom-6">
      <Card padding="lg" className="mx-auto max-w-lg space-y-4 shadow-lg">
        <div className="space-y-2">
          <h2 className="text-title text-base">Объединить прогресс?</h2>
          <p className="text-body text-text-secondary">
            На этом устройстве есть гостевой прогресс. Перенести пройденные уроки
            в аккаунт? XP, серии и награды пока остаются локально на устройстве.
          </p>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void confirmMerge()} disabled={busy}>
            {busy ? "Объединяем…" : "Объединить"}
          </Button>
          <Button variant="outline" onClick={dismiss} disabled={busy}>
            Не сейчас
          </Button>
        </div>
      </Card>
    </div>
  );
}
