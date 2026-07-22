import { Progress } from "@/components/ui/progress";

export function CourseProgressBar({
  percent,
  label = "Course progress",
}: {
  percent: number;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{percent}%</span>
      </div>
      <Progress value={percent} />
    </div>
  );
}
