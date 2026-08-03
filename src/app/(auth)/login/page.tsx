"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  if (!AUTH_ENABLED) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-2xl">Гостевой режим</h1>
          <p className="text-sm text-muted-foreground">
            Вход временно отключён. Продолжайте как гость — аккаунт и синхронизация
            появятся в версии 1.0.
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
        <h1 className="font-display text-2xl">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Sync progress across devices with your account.
        </p>
      </div>
      <div className="space-y-3">
        <Button type="button" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}>
          Continue with Apple
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        New account? Sign in with Google or Apple.
      </p>
      <p className="text-center text-sm">
        <Link href="/dashboard" className="text-muted-foreground hover:underline">
          Continue as guest
        </Link>
      </p>
    </div>
  );
}
