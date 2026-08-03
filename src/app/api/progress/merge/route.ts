import { NextResponse } from "next/server";
import { auth } from "@/data/auth/config";
import { progressBackupSchema } from "@/data/progress/backup";
import { RemoteProgressRepository } from "@/data/progress/remote-repository";
import { normalizeGamificationState } from "@/domain/gamification";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const backup = progressBackupSchema.parse(await request.json());
    const repository = new RemoteProgressRepository(userId);
    await repository.saveSnapshot({
      ...backup.snapshot,
      userId,
      gamification: normalizeGamificationState(backup.snapshot.gamification),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid progress backup" }, { status: 400 });
  }
}
