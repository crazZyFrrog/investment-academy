"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/screen-container";
import { FadeIn } from "@/components/motion";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";

function GuestAccountSection() {
  return (
    <Card padding="lg" className="space-y-3">
      <h2 className="text-title text-base">Аккаунт</h2>
      <p className="text-body text-text-secondary">
        Вы в гостевом режиме. Прогресс сохраняется локально на этом устройстве.
        Вход в аккаунт появится в версии 1.0.
      </p>
    </Card>
  );
}

function AuthenticatedAccountSection() {
  const { data: session } = useSession();

  return (
    <Card padding="lg" className="space-y-4">
      <h2 className="text-title text-base">Аккаунт</h2>
      {session?.user ? (
        <div className="space-y-4">
          <p className="text-body text-text-secondary">
            Вы вошли как {session.user.email ?? session.user.name}
          </p>
          <Button variant="outline" onClick={() => signOut()}>
            Выйти
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Регистрация</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/settings.jpg"
        intensity="reading"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-10 pt-2">
        <FadeIn className="space-y-8">
          <ReadablePanel className="space-y-3">
            <h1 className="text-heading-1">Ещё</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Настройки аккаунта и установка приложения на устройство.
            </p>
          </ReadablePanel>

          <div className="grid max-w-2xl gap-5">
            {AUTH_ENABLED ? (
              <AuthenticatedAccountSection />
            ) : (
              <GuestAccountSection />
            )}

            <Card padding="lg" className="space-y-4">
              <h2 className="text-title text-base">Установить приложение</h2>
              <p className="text-body text-text-secondary">
                Академию можно добавить на домашний экран как PWA — удобно читать
                уроки как отдельное приложение.
              </p>
              <InstallPrompt />
            </Card>
          </div>
        </FadeIn>
      </ScreenContainer>
    </div>
  );
}
