"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

export function MarketingAccountAction() {
  if (!AUTH_ENABLED) {
    return null;
  }

  return <EnabledMarketingAccountAction />;
}

function EnabledMarketingAccountAction() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span
        className="hidden h-8 w-20 animate-pulse rounded-lg bg-white/8 sm:block"
        aria-hidden
      />
    );
  }

  if (session?.user) {
    const label =
      session.user.name?.trim() ||
      session.user.email?.trim() ||
      "Мой аккаунт";

    return (
      <Link
        href="/settings"
        className="max-w-20 truncate rounded-lg px-2 py-1.5 text-xs font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white sm:max-w-32"
        title={label}
      >
        {label}
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hidden text-white/70 hover:bg-white/8 hover:text-white sm:inline-flex"
      asChild
    >
      <Link href="/login">Войти</Link>
    </Button>
  );
}
