"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RefreshCw } from "@/design-system/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <EmptyState
        icon={<RefreshCw />}
        title="Что-то пошло не так"
        description="Не удалось загрузить экран. Попробуйте ещё раз или вернитесь на главную."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Повторить</Button>
            <Button variant="outline" asChild>
              <Link href="/">На главную</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
