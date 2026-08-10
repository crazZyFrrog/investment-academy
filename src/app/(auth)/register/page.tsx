"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

const YANDEX_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_YANDEX_AUTH_ENABLED === "true";

export default function RegisterPage() {
  if (!AUTH_ENABLED) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-2xl">Гостевой режим</h1>
          <p className="text-sm text-muted-foreground">
            Регистрация пока выключена на этом окружении. Продолжайте как гость.
          </p>
        </div>
        <Button className="w-full" asChild>
          <Link href="/dashboard">Продолжить как гость</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-2xl">Создать аккаунт</h1>
        <p className="text-sm text-muted-foreground">
          Сохраняйте и синхронизируйте прогресс обучения.
        </p>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() =>
          signIn(
            "google",
            { callbackUrl: "/dashboard" },
            { prompt: "select_account" }
          )
        }
      >
        Создать через Google
      </Button>
      {YANDEX_AUTH_ENABLED ? (
        <Button
          type="button"
          className="w-full bg-[#ffcc00] text-black hover:bg-[#ffd633]"
          onClick={() => signIn("yandex", { callbackUrl: "/dashboard" })}
        >
          Создать через Яндекс
        </Button>
      ) : null}
      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
