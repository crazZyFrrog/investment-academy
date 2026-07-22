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

/** Solid accent tones for course cards — no gradients */
export const courseAccents: Record<
  string,
  { bg: string; fg: string; label: string }
> = {
  "investing-fundamentals": {
    bg: "bg-[#3d5c52]",
    fg: "text-[#f7faf8]",
    label: "Шаг 1 · Основы",
  },
  "stocks-and-bonds": {
    bg: "bg-[#5c5346]",
    fg: "text-[#faf8f5]",
    label: "Шаг 2 · Инструменты",
  },
  "portfolio-basics": {
    bg: "bg-[#4d5c66]",
    fg: "text-[#f5f7f8]",
    label: "Шаг 3 · Портфель",
  },
  "russia-practice": {
    bg: "bg-[#4a5560]",
    fg: "text-[#f4f6f7]",
    label: "Шаг 4 · Практика",
  },
  "advanced-behavior": {
    bg: "bg-[#5a4f46]",
    fg: "text-[#faf7f4]",
    label: "Шаг 5 · Поведение",
  },
  "advanced-portfolio": {
    bg: "bg-[#45565c]",
    fg: "text-[#f4f8f9]",
    label: "Шаг 6 · Портфель+",
  },
  "advanced-products": {
    bg: "bg-[#56484a]",
    fg: "text-[#faf5f5]",
    label: "Шаг 7 · Продукты",
  },
};

export function getCourseAccent(slug: string) {
  return (
    courseAccents[slug] ?? {
      bg: "bg-primary",
      fg: "text-primary-foreground",
      label: "Курс",
    }
  );
}

/** Local cover images for course cards (optional) */
export const courseCovers: Record<string, string> = {
  "investing-fundamentals": "/images/covers/fundamentals.jpg",
  "stocks-and-bonds": "/images/covers/stocks-bonds.jpg",
  "portfolio-basics": "/images/covers/portfolio.jpg",
  "russia-practice": "/images/covers/russia-practice.jpg",
  "advanced-behavior": "/images/covers/advanced-behavior.jpg",
  "advanced-portfolio": "/images/covers/advanced-portfolio.jpg",
  "advanced-products": "/images/covers/advanced-products.jpg",
};

export function getCourseCover(slug: string): string | undefined {
  return courseCovers[slug];
}

/** Hex accents for SVG charts (match courseAccents backgrounds) */
export const courseAccentHex: Record<string, string> = {
  "investing-fundamentals": "#3d5c52",
  "stocks-and-bonds": "#5c5346",
  "portfolio-basics": "#4d5c66",
  "russia-practice": "#4a5560",
  "advanced-behavior": "#5a4f46",
  "advanced-portfolio": "#45565c",
  "advanced-products": "#56484a",
};

export function getCourseAccentHex(slug: string): string {
  return courseAccentHex[slug] ?? "#3d5c52";
}

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
