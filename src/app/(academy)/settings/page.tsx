"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <FadeIn className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Account preferences and app installation.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border/60 p-6">
        <h2 className="font-medium">Account</h2>
        {session?.user ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Signed in as {session.user.email ?? session.user.name}
            </p>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-border/60 p-6">
        <h2 className="font-medium">Install app</h2>
        <InstallPrompt />
      </section>
    </FadeIn>
  );
}
