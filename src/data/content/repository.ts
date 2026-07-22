import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Course, CourseSummary } from "@/domain/course/types";
import type { Lesson, LessonSummary } from "@/domain/lesson/types";
import { courseMetaSchema, lessonFrontmatterSchema } from "./schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content", "courses");

async function readCourseSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function readCourseMeta(courseSlug: string) {
  const metaPath = path.join(CONTENT_ROOT, courseSlug, "meta.json");
  const raw = await fs.readFile(metaPath, "utf8");
  const parsed = courseMetaSchema.parse(JSON.parse(raw));
  return parsed;
}

async function readLessonFile(courseSlug: string, lessonSlug: string) {
  const lessonPath = path.join(
    CONTENT_ROOT,
    courseSlug,
    "lessons",
    `${lessonSlug}.mdx`
  );
  const raw = await fs.readFile(lessonPath, "utf8");
  const { content, data } = matter(raw);
  const frontmatter = lessonFrontmatterSchema.parse(data);
  return { content, frontmatter };
}

export interface ContentRepository {
  getCourses(): Promise<CourseSummary[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  getLessonSummaries(courseSlug: string): Promise<LessonSummary[]>;
  getLesson(courseSlug: string, lessonSlug: string): Promise<Lesson | null>;
}

export const filesystemContentRepository: ContentRepository = {
  async getCourses() {
    const slugs = await readCourseSlugs();
    const courses = await Promise.all(
      slugs.map(async (slug) => {
        const meta = await readCourseMeta(slug);
        return {
          id: meta.id,
          slug,
          title: meta.title,
          description: meta.description,
          level: meta.level,
          order: meta.order,
          tags: meta.tags,
          estimatedMinutes: meta.estimatedMinutes,
          lessonCount: meta.lessonOrder.length,
        } satisfies CourseSummary;
      })
    );

    return courses.sort((a, b) => a.order - b.order);
  },

  async getCourseBySlug(slug) {
    try {
      const meta = await readCourseMeta(slug);
      return {
        id: meta.id,
        slug,
        title: meta.title,
        description: meta.description,
        level: meta.level,
        order: meta.order,
        tags: meta.tags,
        estimatedMinutes: meta.estimatedMinutes,
        contentVersion: meta.contentVersion,
        lessonOrder: meta.lessonOrder,
        lessonCount: meta.lessonOrder.length,
      };
    } catch {
      return null;
    }
  },

  async getLessonSummaries(courseSlug) {
    const meta = await readCourseMeta(courseSlug);
    const summaries = await Promise.all(
      meta.lessonOrder.map(async (lessonSlug) => {
        const { frontmatter } = await readLessonFile(courseSlug, lessonSlug);
        return {
          id: `${meta.id}:${lessonSlug}`,
          slug: lessonSlug,
          courseId: meta.id,
          courseSlug,
          title: frontmatter.title,
          order: frontmatter.order,
          durationMinutes: frontmatter.durationMinutes,
          objectives: frontmatter.objectives,
          quizId: frontmatter.quizId,
        } satisfies LessonSummary;
      })
    );

    return summaries.sort((a, b) => a.order - b.order);
  },

  async getLesson(courseSlug, lessonSlug) {
    try {
      const meta = await readCourseMeta(courseSlug);
      const { content, frontmatter } = await readLessonFile(
        courseSlug,
        lessonSlug
      );

      return {
        id: `${meta.id}:${lessonSlug}`,
        slug: lessonSlug,
        courseId: meta.id,
        courseSlug,
        title: frontmatter.title,
        order: frontmatter.order,
        durationMinutes: frontmatter.durationMinutes,
        objectives: frontmatter.objectives,
        quizId: frontmatter.quizId,
        content,
      };
    } catch {
      return null;
    }
  },
};

export const contentRepository = filesystemContentRepository;
