export type RewardKind = "course" | "simulator";

export interface RewardDefinition {
  id: string;
  kind: RewardKind;
  title: string;
  description: string;
  minPathCourses: number;
  xpCost: number;
  /** Course slug when kind is course */
  courseSlug?: string;
  /** Optional cover image shown in the rewards catalog */
  cover?: string;
  /** Destination when reward is unlocked */
  href: string;
}

export const REWARD_CATALOG: readonly RewardDefinition[] = [
  {
    id: "first-100k",
    kind: "course",
    courseSlug: "first-100k",
    title: "Первые 100 000 ₽",
    description: "План накопления первых сбережений и первых шагов инвестора.",
    minPathCourses: 1,
    xpCost: 100,
    href: "/courses/first-100k",
  },
  {
    id: "dividends",
    kind: "course",
    courseSlug: "dividends",
    title: "Дивиденды",
    description: "Как работают выплаты акционерам и на что смотреть в первую очередь.",
    minPathCourses: 2,
    xpCost: 250,
    href: "/courses/dividends",
  },
  {
    id: "simulator",
    kind: "simulator",
    title: "Симулятор портфеля",
    description: "Соберите учебный портфель и посмотрите математическую проекцию результата.",
    minPathCourses: 3,
    xpCost: 300,
    cover: "/images/covers/simulator-portfolio-cover.jpg",
    href: "/simulator",
  },
  {
    id: "crypto-without-illusions",
    kind: "course",
    courseSlug: "crypto-without-illusions",
    title: "Крипто без иллюзий",
    description: "Риски, мифы и реалистичный взгляд на цифровые активы.",
    minPathCourses: 4,
    xpCost: 500,
    href: "/courses/crypto-without-illusions",
  },
] as const;

export type RewardId = (typeof REWARD_CATALOG)[number]["id"];

export const sideCourseRewardIds = REWARD_CATALOG.filter(
  (reward) => reward.kind === "course"
).map((reward) => reward.id);

export function getRewardById(id: string): RewardDefinition | undefined {
  return REWARD_CATALOG.find((reward) => reward.id === id);
}

export function getRewardForCourseSlug(
  slug: string
): RewardDefinition | undefined {
  return REWARD_CATALOG.find(
    (reward) => reward.kind === "course" && reward.courseSlug === slug
  );
}
