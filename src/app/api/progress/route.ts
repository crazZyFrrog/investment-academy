import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/data/auth/config";
import { RemoteProgressRepository } from "@/data/progress/remote-repository";
import { logger } from "@/lib/logger";
import { rateLimit, requestIp } from "@/lib/rate-limit";

const mutationSchema = z.object({
  mutation: z.object({
    mutationId: z.string().uuid(),
    courseId: z.string(),
    lessonId: z.string(),
    status: z.enum(["not_started", "in_progress", "completed"]),
    score: z.number().optional(),
    occurredAt: z.string(),
  }),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = new RemoteProgressRepository(session.user.id);
  const snapshot = await repo.getSnapshot();

  return NextResponse.json(
    snapshot ?? {
      userId: session.user.id,
      courses: {},
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function POST(request: Request) {
  const limit = rateLimit(`progress:${requestIp(request)}`, 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = mutationSchema.parse(body);
    const repo = new RemoteProgressRepository(session.user.id);
    await repo.applyMutation(parsed.mutation);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to apply progress mutation", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
