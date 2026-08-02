import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const insightSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const insightsSchema = z.array(insightSchema).min(1);

export type DailyInsight = z.infer<typeof insightSchema>;

export async function getDailyInsights(): Promise<DailyInsight[]> {
  const filePath = path.join(process.cwd(), "content", "insights", "daily.json");
  const raw = await fs.readFile(filePath, "utf8");
  return insightsSchema.parse(JSON.parse(raw));
}

export function pickDailyInsight(
  insights: DailyInsight[],
  at: Date = new Date()
): DailyInsight {
  const day = Math.floor(at.getTime() / 86_400_000);
  return insights[day % insights.length]!;
}
