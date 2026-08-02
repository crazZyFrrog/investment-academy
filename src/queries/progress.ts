"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LocalProgressRepository,
  type CompleteLessonResult,
} from "@/data/progress/local-repository";
import { canSyncProgress, syncProgress } from "@/data/progress/outbox";
import type { CourseProgress } from "@/domain/progress/types";
import { learningPathOrder } from "@/features/catalog/labels";
import { progressKeys } from "./keys";

function getLocalRepo(userId: string) {
  return new LocalProgressRepository(userId);
}

export type { CompleteLessonResult };

export function useCourseProgress(
  userId: string,
  courseId: string,
  totalLessons: number
) {
  return useQuery({
    queryKey: progressKeys.course(userId, courseId),
    queryFn: () =>
      getLocalRepo(userId).getCourseProgress(courseId, totalLessons),
    staleTime: 30_000,
    enabled: Boolean(userId),
  });
}

export function useProgressSnapshot(userId: string) {
  return useQuery({
    queryKey: progressKeys.snapshot(userId),
    queryFn: () => getLocalRepo(userId).getSnapshot(),
    staleTime: 30_000,
    enabled: Boolean(userId),
  });
}

export function useStartLesson(
  userId: string,
  courseId: string,
  totalLessons: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) =>
      getLocalRepo(userId).startLesson(courseId, lessonId, totalLessons),
    onSuccess: (data: CourseProgress) => {
      queryClient.setQueryData(progressKeys.course(userId, courseId), data);
      void queryClient.invalidateQueries({
        queryKey: progressKeys.snapshot(userId),
      });
      if (canSyncProgress(userId)) {
        void syncProgress(userId);
      }
    },
  });
}

export function useCompleteLesson(
  userId: string,
  courseId: string,
  totalLessons: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      score,
      pathCourseCount = learningPathOrder.length,
    }: {
      lessonId: string;
      score?: number;
      pathCourseCount?: number;
    }) =>
      getLocalRepo(userId).completeLesson(
        courseId,
        lessonId,
        totalLessons,
        score,
        pathCourseCount
      ),
    onSuccess: (data: CompleteLessonResult) => {
      queryClient.setQueryData(
        progressKeys.course(userId, courseId),
        data.courseProgress
      );
      void queryClient.invalidateQueries({
        queryKey: progressKeys.snapshot(userId),
      });
      if (canSyncProgress(userId)) {
        void syncProgress(userId);
      }
    },
  });
}

export function useSyncProgress(userId: string) {
  return useMutation({
    mutationFn: () => syncProgress(userId),
  });
}

export function useResetProgress(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await getLocalRepo(userId).clearProgress();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}

export function useImportProgress(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshot: import("@/domain/progress/types").ProgressSnapshot) => {
      await getLocalRepo(userId).saveSnapshot(snapshot);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}
