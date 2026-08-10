"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

const YANDEX_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_YANDEX_AUTH_ENABLED === "true";

export default function LoginPage() {
  const { status } = useSession();

  if (!AUTH_ENABLED) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-2xl">Гостевой режим</h1>
          <p className="text-sm text-muted-foreground">
            Вход пока выключен на этом окружении. Продолжайте как гость — прогресс
            сохранится на устройстве. Чтобы включить аккаунт, задайте
            NEXT_PUBLIC_AUTH_ENABLED=true и OAuth-ключи (см. docs/SETUP_V1.md).
          </p>
        </div>
        <Button className="w-full" asChild>
          <Link href="/dashboard">Продолжить как гость</Link>
        </Button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Проверяем текущую сессию…
      </p>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-2xl">Вы уже вошли</h1>
          <p className="text-sm text-muted-foreground">
            Чтобы использовать другой аккаунт, сначала завершите текущую сессию.
          </p>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Выйти и сменить аккаунт
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard">Вернуться в академию</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-2xl">Вход</h1>
        <p className="text-sm text-muted-foreground">
          Синхронизируйте прогресс уроков между устройствами через аккаунт.
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
        Войти через Google
      </Button>
      {YANDEX_AUTH_ENABLED ? (
        <Button
          type="button"
          className="w-full bg-[#ffcc00] text-black hover:bg-[#ffd633]"
          onClick={() => signIn("yandex", { callbackUrl: "/dashboard" })}
        >
          Войти через Яндекс
        </Button>
      ) : null}
      <p className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
      <p className="text-center text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:underline"
        >
          Продолжить как гость
        </Link>
      </p>
    </div>
  );
}
