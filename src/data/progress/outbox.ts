import { AUTH_ENABLED } from "@/data/auth/flags";
import type { ProgressMutation } from "@/domain/progress/types";
import { LocalProgressRepository } from "./local-repository";

/** Guests keep progress local-only — remote sync requires Auth.js. */
export function canSyncProgress(userId: string): boolean {
  if (!AUTH_ENABLED) return false;
  if (!userId || userId === "guest-ssr") return false;
  return !userId.startsWith("guest-");
}

export async function flushOutbox(userId: string): Promise<number> {
  if (!canSyncProgress(userId)) {
    return 0;
  }

  const localRepo = new LocalProgressRepository(userId);
  const outbox = await localRepo.getOutbox();

  if (outbox.length === 0) {
    return 0;
  }

  let synced = 0;

  for (const item of outbox) {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutation: item satisfies ProgressMutation }),
      });

      if (!response.ok) {
        // Drop permanently unauthorized items so the outbox cannot grow forever
        if (response.status === 401 || response.status === 403) {
          await localRepo.removeFromOutbox(item.mutationId);
        }
        continue;
      }

      await localRepo.removeFromOutbox(item.mutationId);
      synced += 1;
    } catch {
      // Remain in outbox for next retry
    }
  }

  return synced;
}

export async function syncProgress(userId: string): Promise<void> {
  if (!canSyncProgress(userId)) {
    return;
  }

  const localRepo = new LocalProgressRepository(userId);

  try {
    const response = await fetch("/api/progress");
    if (response.ok) {
      const remote = await response.json();
      if (remote?.courses) {
        await localRepo.mergeSnapshot(remote);
      }
    }
  } catch {
    // Offline — local remains source of truth
  }

  await flushOutbox(userId);
}
