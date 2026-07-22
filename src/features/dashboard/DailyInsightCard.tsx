import { Card } from "@/components/ui/card";

const insights = [
  {
    title: "Дисциплина сильнее прогноза",
    body: "Регулярные взносы и длинный горизонт обычно дают больше, чем попытка угадать «идеальный» день входа.",
  },
  {
    title: "Просадка — часть пути",
    body: "Колебания рынка нормальны. Риск для цели чаще создаёт паническая продажа, а не сам факт снижения цены.",
  },
  {
    title: "Простота — это зрелость",
    body: "Широкий фонд и понятный план часто лучше сложного набора идей, за которыми трудно уследить.",
  },
];

function pickInsight() {
  const day = Math.floor(Date.now() / 86_400_000);
  return insights[day % insights.length];
}

export function DailyInsightCard() {
  const insight = pickInsight();

  return (
    <Card padding="md" variant="muted" className="shadow-none">
      <p className="text-label">Мысль дня</p>
      <h3 className="mt-3 text-title">{insight.title}</h3>
      <p className="mt-2 text-body text-text-secondary">{insight.body}</p>
    </Card>
  );
}
