"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonCompleteCta({
  onComplete,
  loading,
}: {
  onComplete: () => void;
  loading?: boolean;
}) {
  return (
    <Button size="lg" onClick={onComplete} disabled={loading}>
      <Check className="h-4 w-4" />
      {loading ? "Saving progress..." : "Mark lesson complete"}
    </Button>
  );
}
