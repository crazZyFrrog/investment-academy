"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { LogOut, User } from "@/design-system/icons";
import { SyncStatusBadge } from "@/components/progress/SyncStatusBadge";
import { cn } from "@/lib/utils";

function displayName(user: {
  name?: string | null;
  email?: string | null;
}): string {
  return user.name?.trim() || user.email?.trim() || "Аккаунт";
}

export function UserAccountPanel({
  className,
  dense = false,
}: {
  className?: string;
  /** Single-row layout for mobile top bar */
  dense?: boolean;
}) {
  const { data: session, status } = useSession();

  if (!AUTH_ENABLED) {
    return null;
  }

  if (status === "loading") {
    return (
      <div
        className={cn(
          dense ? "h-8 w-28 animate-pulse rounded-[var(--radius-md)] bg-muted" : "border-t border-border px-3 py-3",
          className
        )}
      >
        {!dense ? (
          <div className="h-9 animate-pulse rounded-[var(--radius-md)] bg-muted" />
        ) : null}
      </div>
    );
  }

  if (!session?.user) {
    if (dense) {
      return (
        <div className={cn("flex shrink-0 items-center gap-2", className)}>
          <SyncStatusBadge compact />
          <Link
            href="/login"
            className="rounded-[var(--radius-lg)] px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-muted/70"
          >
            Войти
          </Link>
        </div>
      );
    }

    return (
      <div className={cn("border-t border-border px-3 py-3", className)}>
        <div className="flex items-center gap-2">
          <SyncStatusBadge compact />
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted/70"
          >
            Войти
          </Link>
        </div>
      </div>
    );
  }

  const name = displayName(session.user);
  const email = session.user.email?.trim();
  const showEmailUnderName = Boolean(
    session.user.name?.trim() && email && session.user.name.trim() !== email
  );

  if (dense) {
    return (
      <div className={cn("flex min-w-0 max-w-[min(13rem,52vw)] shrink items-center gap-1.5", className)}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-right text-xs font-medium text-text-primary" title={name}>
            {name}
          </p>
        </div>
        <SyncStatusBadge compact className="shrink-0" />
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-text-secondary transition-colors hover:bg-muted/70 hover:text-text-primary"
          aria-label="Выйти"
          title="Выйти"
        >
          <LogOut className="size-3.5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("border-t border-border px-3 py-3", className)}>
      <div className="flex min-w-0 items-start gap-2">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-text-secondary"
          aria-hidden
        >
          <User className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-medium text-text-primary"
            title={name}
          >
            {name}
          </p>
          {showEmailUnderName ? (
            <p
              className="truncate text-[0.7rem] text-text-tertiary"
              title={email}
            >
              {email}
            </p>
          ) : null}
        </div>
        <SyncStatusBadge compact className="shrink-0" />
      </div>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-muted/70 hover:text-text-primary"
      >
        <LogOut className="size-3.5 shrink-0" aria-hidden />
        Выйти
      </button>
    </div>
  );
}
