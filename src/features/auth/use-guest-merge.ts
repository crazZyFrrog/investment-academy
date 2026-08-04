"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { createProgressBackup } from "@/data/progress/backup";
import { LocalProgressRepository } from "@/data/progress/local-repository";
import { syncProgress } from "@/data/progress/outbox";
import { clearGuestId, getGuestId } from "@/hooks/use-user-id.guest";
import { progressKeys } from "@/queries/keys";
import { guestHasProgress } from "./guest-progress";

const MERGE_PROMPT_KEY = "investment-academy-merge-prompted";

/**
 * After OAuth sign-in, offer to merge local guest progress into the account.
 */
export function useGuestMerge() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!AUTH_ENABLED || status !== "authenticated" || !userId) {
      return;
    }

    if (sessionStorage.getItem(MERGE_PROMPT_KEY) === userId) {
      return;
    }

    const localGuestId = getGuestId();
    if (!localGuestId || !localGuestId.startsWith("guest-")) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const snapshot = await new LocalProgressRepository(
          localGuestId
        ).getSnapshot();
        if (cancelled) return;
        if (!guestHasProgress(snapshot)) {
          sessionStorage.setItem(MERGE_PROMPT_KEY, userId);
          return;
        }
        setGuestId(localGuestId);
        setOpen(true);
      } catch {
        // Ignore IndexedDB errors; user can still sync manually.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, userId]);

  function dismiss() {
    if (userId) {
      sessionStorage.setItem(MERGE_PROMPT_KEY, userId);
    }
    setOpen(false);
    setError(null);
  }

  async function confirmMerge() {
    if (!userId || !guestId) return;

    setBusy(true);
    setError(null);

    try {
      const guestRepo = new LocalProgressRepository(guestId);
      const snapshot = await guestRepo.getSnapshot();
      const backup = createProgressBackup({
        ...snapshot,
        userId,
      });

      const response = await fetch("/api/progress/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backup),
      });

      if (!response.ok) {
        throw new Error("Не удалось объединить прогресс");
      }

      await syncProgress(userId);
      await guestRepo.clearProgress();
      clearGuestId();
      sessionStorage.setItem(MERGE_PROMPT_KEY, userId);
      await queryClient.invalidateQueries({ queryKey: progressKeys.all });
      setOpen(false);
    } catch (mergeError) {
      setError(
        mergeError instanceof Error
          ? mergeError.message
          : "Не удалось объединить прогресс"
      );
    } finally {
      setBusy(false);
    }
  }

  return {
    open,
    busy,
    error,
    confirmMerge,
    dismiss,
  };
}
