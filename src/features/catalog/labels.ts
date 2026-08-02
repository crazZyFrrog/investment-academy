/**
 * Product copy helpers — Russian UI labels for the learning experience.
 */
export const levelLabels = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
} as const;

export type CourseLevelKey = keyof typeof levelLabels;

/** Recommended learning order (slug → step number) */
export const learningPathOrder = [
  "investing-fundamentals",
  "stocks-and-bonds",
  "portfolio-basics",
  "russia-practice",
  "advanced-behavior",
  "advanced-portfolio",
  "advanced-products",
] as const;

export function formatLessonCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} урок`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} урока`;
  }
  return `${count} уроков`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} ч`;
  return `${hours} ч ${rest} мин`;
}

/** Level-driven editorial accents: sage → slate → amber */
const levelAccentTokens = {
  beginner: {
    bg: "bg-[#2A5C58]",
    fg: "text-[#f4faf8]",
    hex: "#2A5C58",
  },
  intermediate: {
    bg: "bg-[#3D5A66]",
    fg: "text-[#f4f8f9]",
    hex: "#3D5A66",
  },
  advanced: {
    bg: "bg-[#C88745]",
    fg: "text-[#fffaf3]",
    hex: "#C88745",
  },
} as const;

const courseMeta: Record<
  string,
  { step: number; short: string; level: CourseLevelKey }
> = {
  "investing-fundamentals": {
    step: 1,
    short: "Основы",
    level: "beginner",
  },
  "stocks-and-bonds": {
    step: 2,
    short: "Инструменты",
    level: "beginner",
  },
  "portfolio-basics": {
    step: 3,
    short: "Портфель",
    level: "intermediate",
  },
  "russia-practice": {
    step: 4,
    short: "Практика",
    level: "beginner",
  },
  "advanced-behavior": {
    step: 5,
    short: "Поведение",
    level: "advanced",
  },
  "advanced-portfolio": {
    step: 6,
    short: "Портфель+",
    level: "advanced",
  },
  "advanced-products": {
    step: 7,
    short: "Продукты",
    level: "advanced",
  },
  "first-100k": {
    step: 0,
    short: "План",
    level: "beginner",
  },
  dividends: {
    step: 0,
    short: "Дивиденды",
    level: "intermediate",
  },
  "crypto-without-illusions": {
    step: 0,
    short: "Крипто",
    level: "intermediate",
  },
};

/** Side courses outside the sequential main path */
export const sideCourseSlugs = [
  "first-100k",
  "dividends",
  "crypto-without-illusions",
] as const;

export function isLearningPathCourse(slug: string): boolean {
  return (learningPathOrder as readonly string[]).includes(slug);
}

export type CourseAccent = {
  bg: string;
  fg: string;
  label: string;
  step: number;
  short: string;
  hex: string;
};

export function getCourseAccent(slug: string): CourseAccent {
  const meta = courseMeta[slug];
  if (!meta) {
    return {
      bg: "bg-primary",
      fg: "text-primary-foreground",
      label: "Курс",
      step: 0,
      short: "Курс",
      hex: "#173f4a",
    };
  }
  const tokens = levelAccentTokens[meta.level];
  const label =
    meta.step > 0
      ? `Шаг ${meta.step} · ${meta.short}`
      : `Дополнительно · ${meta.short}`;
  return {
    bg: tokens.bg,
    fg: tokens.fg,
    label,
    step: meta.step,
    short: meta.short,
    hex: tokens.hex,
  };
}

/** Local cover images for course cards (optional) */
export const courseCovers: Record<string, string> = {
  "investing-fundamentals": "/images/covers/fundamentals-living.jpg",
  "stocks-and-bonds": "/images/covers/stocks-bonds-living.jpg",
  "portfolio-basics": "/images/covers/portfolio-living.jpg",
  "russia-practice": "/images/covers/russia-practice-living.jpg",
  "advanced-behavior": "/images/covers/advanced-behavior-system.jpg",
  "advanced-portfolio": "/images/covers/advanced-portfolio-system.jpg",
  "advanced-products": "/images/covers/advanced-products-system.jpg",
  "first-100k": "/images/covers/first-100k-cover.jpg",
  dividends: "/images/covers/dividends-cover.jpg",
  "crypto-without-illusions": "/images/covers/crypto-without-illusions-cover.jpg",
};

export function getCourseCover(slug: string): string | undefined {
  return courseCovers[slug];
}

/** Hex accents for SVG charts */
export function getCourseAccentHex(slug: string): string {
  return getCourseAccent(slug).hex;
}

/** @deprecated use getCourseAccent / getCourseAccentHex */
export const courseAccents = Object.fromEntries(
  Object.keys(courseMeta).map((slug) => {
    const accent = getCourseAccent(slug);
    return [slug, { bg: accent.bg, fg: accent.fg, label: accent.label }];
  })
) as Record<string, { bg: string; fg: string; label: string }>;

/** @deprecated use getCourseAccentHex */
export const courseAccentHex = Object.fromEntries(
  Object.keys(courseMeta).map((slug) => [slug, getCourseAccent(slug).hex])
) as Record<string, string>;

export function sortByLearningPath<T extends { slug: string; order: number }>(
  courses: T[]
): T[] {
  const rank = new Map<string, number>(
    learningPathOrder.map((slug, index) => [slug, index])
  );
  return [...courses].sort((a, b) => {
    const ra = rank.get(a.slug) ?? a.order + 100;
    const rb = rank.get(b.slug) ?? b.order + 100;
    return ra - rb;
  });
}
