import Link from "next/link";
import { cn } from "@/lib/utils";

export function EducationalDisclaimer({
  className,
}: {
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-caption leading-relaxed text-text-tertiary",
        className
      )}
    >
      Материалы носят образовательный характер и не являются индивидуальной
      инвестиционной или налоговой рекомендацией. Условия продуктов и нормы
      права могут меняться — сверяйте актуальные правила в официальных
      источниках.{" "}
      <Link
        href="/about"
        className="underline decoration-border underline-offset-2 hover:text-text-secondary"
      >
        Подробнее
      </Link>
      {" · "}
      <Link
        href="/privacy"
        className="underline decoration-border underline-offset-2 hover:text-text-secondary"
      >
        Конфиденциальность
      </Link>
      {" · "}
      <Link
        href="/terms"
        className="underline decoration-border underline-offset-2 hover:text-text-secondary"
      >
        Условия
      </Link>
    </p>
  );
}
