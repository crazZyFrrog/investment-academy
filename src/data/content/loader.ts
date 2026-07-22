import { contentRepository } from "./repository";

export async function getCourses() {
  return contentRepository.getCourses();
}

export async function getCourseBySlug(slug: string) {
  return contentRepository.getCourseBySlug(slug);
}

export async function getLessonSummaries(courseSlug: string) {
  return contentRepository.getLessonSummaries(courseSlug);
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  return contentRepository.getLesson(courseSlug, lessonSlug);
}
