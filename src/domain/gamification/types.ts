export interface GamificationState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  /** YYYY-MM-DD in local timezone */
  lastActivityDate: string | null;
  todayCompletedLessons: number;
  /** Local date the todayCompletedLessons counter applies to */
  todayDate: string | null;
  unlockedAchievementIds: string[];
  /** Recent activity days (YYYY-MM-DD), newest last, capped */
  activityDates: string[];
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
}

export interface LessonCompletedReward {
  state: GamificationState;
  xpGained: number;
  leveledUp: boolean;
  previousLevel: number;
  streakExtended: boolean;
  dailyGoalCompleted: boolean;
  newlyUnlockedAchievementIds: string[];
}

export interface ApplyLessonCompletedInput {
  state: GamificationState;
  /** Snapshot courses AFTER the lesson was marked completed */
  courses: Record<
    string,
    {
      completedLessons: number;
      totalLessons: number;
    }
  >;
  courseJustCompleted: boolean;
  pathCourseCount: number;
  now?: Date;
}
