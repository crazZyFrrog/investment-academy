"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CourseSummary } from "@/domain/course/types";
import {
  listRewardViewModels,
  type RewardViewModel,
} from "@/domain/rewards";
import { buildCoursesBySlug } from "@/features/learning/unlock";
import { getSnapshotXp } from "@/features/learning/side-course-rewards";
import { useUserId } from "@/hooks/use-user-id";
import { useProgressSnapshot, useRedeemReward } from "@/queries/progress";
import { ArrowRight, Gift, Lock, Sparkles } from "@/design-system/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { FadeIn } from "@/components/motion";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";
import { ScreenContainer } from "@/components/ui/screen-container";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourseCover } from "@/features/catalog/labels";
import Image from "next/image";

function statusLabel(status: RewardViewModel["status"]) {
  switch (status) {
    case "unlocked":
      return "Открыто";
    case "redeemable":
      return "Можно обменять";
    case "need_xp":
      return "Нужно XP";
    case "need_path":
      return "Нужен прогресс";
  }
}

function RewardCard({
  item,
  onRedeem,
  isRedeeming,
}: {
  item: RewardViewModel;
  onRedeem: (rewardId: string) => void;
  isRedeeming: boolean;
}) {
  const { reward, status, pathDone, xpBalance } = item;
  const cover =
    reward.cover ??
    (reward.kind === "course" && reward.courseSlug
      ? getCourseCover(reward.courseSlug)
      : undefined);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 overflow-hidden bg-muted sm:h-36">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent/10">
            <Sparkles className="size-8 text-accent" aria-hidden />
          </div>
        )}
        <span className="absolute top-3 right-3 rounded-[var(--radius-md)] bg-background/90 px-2 py-1 text-[0.65rem] font-medium text-text-primary shadow-xs backdrop-blur-sm">
          {statusLabel(status)}
        </span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="muted" size="sm">
              {reward.kind === "course" ? "Доп. курс" : "Практика"}
            </Chip>
            <span className="text-caption text-text-tertiary">
              {reward.xpCost} XP
            </span>
          </div>
          <h2 className="text-title">{reward.title}</h2>
          <p className="text-body text-text-secondary">{reward.description}</p>
          <p className="text-caption text-text-tertiary">
            Условие: {reward.minPathCourses}{" "}
            {reward.minPathCourses === 1 ? "курс" : "курса"} основного пути
            {status !== "unlocked"
              ? ` · сейчас ${pathDone}`
              : null}
          </p>
        </div>

        {status === "unlocked" ? (
          <Button asChild>
            <Link href={reward.href}>
              Перейти
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : status === "redeemable" ? (
          <Button
            onClick={() => onRedeem(reward.id)}
            disabled={isRedeeming}
          >
            Обменять за {reward.xpCost} XP
            <Gift className="size-4" />
          </Button>
        ) : status === "need_xp" ? (
          <Button variant="outline" disabled>
            <Lock className="size-4" />
            Нужно {reward.xpCost} XP (есть {xpBalance})
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <Lock className="size-4" />
            Завершите {reward.minPathCourses}{" "}
            {reward.minPathCourses === 1 ? "курс" : "курса"} пути
          </Button>
        )}
      </div>
    </Card>
  );
}

export function RewardsPageClient({
  courses,
}: {
  courses: CourseSummary[];
}) {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);
  const redeemMutation = useRedeemReward(userId);
  const [error, setError] = useState<string | null>(null);

  const bySlug = useMemo(() => buildCoursesBySlug(courses), [courses]);
  const rewards = useMemo(
    () => listRewardViewModels(snapshot, bySlug),
    [snapshot, bySlug]
  );
  const xpBalance = getSnapshotXp(snapshot);

  async function handleRedeem(rewardId: string) {
    setError(null);
    try {
      await redeemMutation.mutateAsync({ rewardId, coursesBySlug: bySlug });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось обменять XP.");
    }
  }

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/dashboard.jpg"
        intensity="catalog"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-8">
        <FadeIn className="space-y-4">
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Магазин прогресса</p>
            <h1 className="text-heading-1">Награды</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Тратьте XP на то, что интересно прямо сейчас: дополнительный курс
              или симулятор портфеля. Сначала нужно пройти часть основного пути.
            </p>
            {!isLoading ? (
              <p className="text-sm font-medium text-text-primary">
                Баланс:{" "}
                <span className="tabular-nums text-primary">{xpBalance} XP</span>
              </p>
            ) : null}
          </ReadablePanel>
        </FadeIn>

        {error ? (
          <p className="rounded-[var(--radius-lg)] border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-text-primary">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-72 rounded-[var(--radius-xl)]" />
            <Skeleton className="h-72 rounded-[var(--radius-xl)]" />
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {rewards.map((item) => (
              <FadeIn key={item.reward.id}>
                <RewardCard
                  item={item}
                  onRedeem={handleRedeem}
                  isRedeeming={redeemMutation.isPending}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
