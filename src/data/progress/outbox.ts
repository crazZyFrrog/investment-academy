import type { ProgressMutation } from "@/domain/progress/types";
import { LocalProgressRepository } from "./local-repository";

export async function flushOutbox(userId: string): Promise<number> {
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
