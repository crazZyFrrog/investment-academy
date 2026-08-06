"use client";

import { useRef, useState } from "react";
import { Download, Trash2, Upload } from "@/design-system/icons";
import { useUserId } from "@/hooks/use-user-id";
import {
  useImportProgress,
  useProgressSnapshot,
  useResetProgress,
} from "@/queries/progress";
import {
  createProgressBackup,
  parseProgressBackupJson,
  snapshotForUser,
} from "@/data/progress/backup";
import { useQuizDraftStore } from "@/stores/quiz-draft-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProgressBackupSettings() {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);
  const resetProgress = useResetProgress(userId);
  const importProgress = useImportProgress(userId);
  const clearQuizDrafts = useQuizDraftStore((state) => state.clearAll);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const courseCount = snapshot ? Object.keys(snapshot.courses).length : 0;

  async function handleExport() {
    setError(null);
    setMessage(null);
    if (!snapshot) {
      setError("Прогресс ещё не загрузился.");
      return;
    }
    const backup = createProgressBackup(snapshot);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `investment-academy-progress-${stamp}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Файл прогресса скачан.");
  }

  async function handleImportFile(file: File) {
    setError(null);
    setMessage(null);
    const confirmed = window.confirm(
      "Заменить локальный прогресс данными из файла? Текущие данные на этом устройстве будут перезаписаны."
    );
    if (!confirmed) return;
    try {
      const text = await file.text();
      const backup = parseProgressBackupJson(text);
      const next = snapshotForUser(backup.snapshot, userId);
      await importProgress.mutateAsync(next);
      clearQuizDrafts();
      setMessage("Прогресс восстановлен из файла.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось прочитать файл прогресса."
      );
    }
  }

  async function handleReset() {
    setError(null);
    setMessage(null);
    const confirmed = window.confirm(
      "Сбросить весь локальный прогресс на этом устройстве? Это действие нельзя отменить."
    );
    if (!confirmed) return;
    try {
      await resetProgress.mutateAsync();
      clearQuizDrafts();
      setMessage("Локальный прогресс сброшен.");
    } catch {
      setError("Не удалось сбросить прогресс.");
    }
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-title text-base">Локальный прогресс</h2>
        <p className="text-body text-text-secondary">
          Экспортируйте JSON-бэкап перед сменой браузера или сбросьте данные на
          этом устройстве. Сейчас учтено курсов с прогрессом:{" "}
          <span className="text-text-primary">
            {!userId || isLoading ? "…" : courseCount}
          </span>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!userId || isLoading || resetProgress.isPending}
          onClick={() => void handleExport()}
        >
          <Download />
          Экспорт
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!userId || importProgress.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
          Импорт
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={!userId || resetProgress.isPending}
          onClick={() => void handleReset()}
        >
          <Trash2 />
          Сбросить
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleImportFile(file);
          }}
        />
      </div>

      {message ? (
        <p className="text-caption text-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-caption text-error" role="alert">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
