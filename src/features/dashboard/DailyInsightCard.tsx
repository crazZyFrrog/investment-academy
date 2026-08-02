import { Card } from "@/components/ui/card";
import type { DailyInsight } from "@/data/content/insights";

export function DailyInsightCard({ insight }: { insight: DailyInsight }) {
  return (
    <Card padding="md" variant="muted" className="shadow-none">
      <p className="text-label">Мысль дня</p>
      <h3 className="mt-3 text-title">{insight.title}</h3>
      <p className="mt-2 text-body text-text-secondary">{insight.body}</p>
    </Card>
  );
}
