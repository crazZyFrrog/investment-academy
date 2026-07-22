export const progressKeys = {
  all: ["progress"] as const,
  snapshot: (userId: string) => [...progressKeys.all, "snapshot", userId] as const,
  course: (userId: string, courseId: string) =>
    [...progressKeys.all, "course", userId, courseId] as const,
};

export const catalogKeys = {
  all: ["catalog"] as const,
  courses: () => [...catalogKeys.all, "courses"] as const,
  course: (slug: string) => [...catalogKeys.all, "course", slug] as const,
  lessons: (courseSlug: string) =>
    [...catalogKeys.all, "lessons", courseSlug] as const,
};
