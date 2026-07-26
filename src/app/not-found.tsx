import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "@/design-system/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <EmptyState
        icon={<BookOpen />}
        title="Страница не найдена"
        description="Такого адреса нет. Вернитесь в академию или откройте каталог курсов."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard">На дашборд</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">К курсам</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
