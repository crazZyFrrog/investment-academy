"use client";

import { Monitor, Moon, Sun } from "@/design-system/icons";
import { useTheme } from "@/design-system/theme";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const options = [
  { id: "light" as const, label: "Светлая", icon: Sun },
  { id: "dark" as const, label: "Тёмная", icon: Moon },
  { id: "system" as const, label: "Система", icon: Monitor },
];

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card padding="lg" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-title text-base">Оформление</h2>
        <p className="text-body text-text-secondary">
          Выберите светлую или тёмную тему — или следовать настройкам системы.
        </p>
      </div>
      <div
        className="grid grid-cols-3 gap-2"
        role="radiogroup"
        aria-label="Тема оформления"
      >
        {options.map(({ id, label, icon: Icon }) => {
          const selected = theme === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              data-theme-option={id}
              aria-checked={selected}
              aria-label={label}
              onClick={() => setTheme(id)}
              className={cn(
                "inline-flex h-auto flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 py-3 text-xs font-medium transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-text-primary hover:bg-surface-secondary"
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
