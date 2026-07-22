"use client";

import { useEffect, useState } from "react";
import { Download } from "@/design-system/icons";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (installed) {
    return (
      <p className="text-sm text-text-secondary">
        Приложение уже установлено на этом устройстве.
      </p>
    );
  }

  if (!deferredPrompt) {
    return (
      <p className="text-sm text-text-secondary">
        Кнопка установки появится в поддерживаемом браузере. На iPhone: «Поделиться»
        → «На экран „Домой“».
      </p>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setDeferredPrompt(null);
        }
      }}
    >
      <Download className="size-4" />
      Установить
    </Button>
  );
}
