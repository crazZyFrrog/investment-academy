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
import { ThemeSettings } from "@/features/settings/ThemeSettings";
import { ProgressBackupSettings } from "@/features/settings/ProgressBackupSettings";
import { SyncSettings } from "@/features/settings/SyncSettings";
import { SyncStatusBadge } from "@/components/progress/SyncStatusBadge";

function GuestAccountSection() {
  return (
    <Card padding="lg" className="space-y-3">
      <h2 className="text-title text-base">Аккаунт</h2>
      <p className="text-body text-text-secondary">
        Вы в гостевом режиме. Прогресс сохраняется локально на этом устройстве.
      </p>
      {AUTH_ENABLED ? (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Регистрация</Link>
          </Button>
        </div>
      ) : (
        <p className="text-caption text-text-tertiary">
          Облачный вход на этом окружении выключен. См. docs/SETUP_V1.md.
        </p>
      )}
    </Card>
  );
}

function AuthenticatedAccountSection() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <GuestAccountSection />;
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title text-base">Аккаунт</h2>
        <SyncStatusBadge />
      </div>
      <p className="text-body text-text-secondary">
        Вы вошли как {session.user.email ?? session.user.name}
      </p>
      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
        Выйти
      </Button>
    </Card>
  );
}

function LegalLinks() {
  return (
    <Card padding="lg" className="space-y-3">
      <h2 className="text-title text-base">Документы</h2>
      <ul className="space-y-2 text-body text-text-secondary">
        <li>
          <Link href="/privacy" className="hover:text-text-primary hover:underline">
            Политика конфиденциальности
          </Link>
        </li>
        <li>
          <Link href="/terms" className="hover:text-text-primary hover:underline">
            Условия использования
          </Link>
        </li>
        <li>
          <Link
            href="/delete-account"
            className="hover:text-text-primary hover:underline"
          >
            Удаление аккаунта
          </Link>
        </li>
      </ul>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/settings.jpg"
        intensity="progress"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-10 pt-2">
        <FadeIn className="space-y-8">
          <ReadablePanel className="space-y-3">
            <h1 className="text-heading-1">Ещё</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Аккаунт, синхронизация, тема, локальный прогресс и установка
              приложения.
            </p>
          </ReadablePanel>

          <div className="grid max-w-2xl gap-5">
            {AUTH_ENABLED ? (
              <AuthenticatedAccountSection />
            ) : (
              <GuestAccountSection />
            )}

            <SyncSettings />
            <ThemeSettings />
            <ProgressBackupSettings />

            <Card padding="lg" className="space-y-4">
              <h2 className="text-title text-base">Установить приложение</h2>
              <p className="text-body text-text-secondary">
                Академию можно добавить на домашний экран как PWA — удобно читать
                уроки как отдельное приложение.
              </p>
              <InstallPrompt />
            </Card>

            <LegalLinks />
          </div>
        </FadeIn>
      </ScreenContainer>
    </div>
  );
}
