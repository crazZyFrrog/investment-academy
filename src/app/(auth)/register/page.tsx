"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  if (!AUTH_ENABLED) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-2xl">Гостевой режим</h1>
          <p className="text-sm text-muted-foreground">
            Регистрация временно отключена. Продолжайте как гость — создание
            аккаунта появится в версии 1.0.
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
        <h1 className="font-display text-2xl">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Save and sync your learning progress.
        </p>
      </div>
      <div className="space-y-3">
        <Button type="button" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Create account with Google
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}>
          Create account with Apple
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
