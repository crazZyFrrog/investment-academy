"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/design-system/icons";
import { useTheme } from "@/design-system/theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function subscribeNoop() {
  return () => {};
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

export function ThemeToggle({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "onDark";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const ready = useSyncExternalStore(
    subscribeNoop,
    getClientReady,
    getServerReady
  );

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "shrink-0",
        variant === "onDark" &&
          "text-white/80 hover:bg-white/8 hover:text-white",
        className
      )}
      aria-label={ready ? label : "Сменить тему"}
      title={ready ? label : "Сменить тему"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {ready && isDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </Button>
  );
}
