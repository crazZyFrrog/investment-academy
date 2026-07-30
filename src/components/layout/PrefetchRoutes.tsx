"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_ROUTES = ["/dashboard", "/courses"] as const;

/**
 * Starts compiling/prefetching likely next routes as soon as the marketing
 * page hydrates. Needed because Next.js disables Link viewport/hover prefetch
 * in development (it would otherwise compile routes on sight).
 */
export function PrefetchRoutes({
  routes = DEFAULT_ROUTES,
}: {
  routes?: readonly string[];
}) {
  const router = useRouter();

  useEffect(() => {
    for (const href of routes) {
      router.prefetch(href);
    }
  }, [router, routes]);

  return null;
}
