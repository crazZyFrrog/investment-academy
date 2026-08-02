"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/data/content/glossary";
import { Search, X } from "@/design-system/icons";
import { FadeIn } from "@/components/motion";
import { ScreenContainer } from "@/components/ui/screen-container";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function firstLetter(term: string): string {
  const ch = term.trim().charAt(0).toLocaleUpperCase("ru-RU");
  return ch || "#";
}

export function GlossaryPageClient({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return terms;
    return terms.filter((item) => {
      const haystack = `${item.term} ${item.definition}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [terms, normalized]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const letter = firstLetter(term.term);
      const list = map.get(letter) ?? [];
      list.push(term);
      map.set(letter, list);
    }
    return [...map.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], "ru")
    );
  }, [filtered]);

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/courses.jpg"
        intensity="catalog"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-8">
        <FadeIn className="space-y-4">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
            <Link href="/dashboard">← На главную</Link>
          </Button>
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Справочник</p>
            <h1 className="text-heading-1">Словарь</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Короткие определения в тоне академии. Не замена урокам — опора
              рядом с ними.
            </p>
          </ReadablePanel>
        </FadeIn>

        <label className="relative block max-w-xl">
          <span className="sr-only">Поиск по словарю</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-tertiary"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти термин…"
            className="h-11 w-full rounded-[var(--radius-lg)] border border-border bg-surface pr-10 pl-10 text-sm text-text-primary shadow-xs outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-[var(--radius-md)] p-1.5 text-text-tertiary hover:bg-muted hover:text-text-primary"
              aria-label="Очистить поиск"
              onClick={() => setQuery("")}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </label>

        {groups.length === 0 ? (
          <p className="py-12 text-center text-caption">Ничего не найдено.</p>
        ) : (
          <div className="space-y-8">
            {groups.map(([letter, items]) => (
              <section key={letter} className="space-y-3">
                <h2 className="font-display text-2xl text-text-primary">
                  {letter}
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      id={item.id}
                      className="rounded-[var(--radius-xl)] border border-border bg-surface/80 px-5 py-4"
                    >
                      <h3 className="text-title text-text-primary">
                        {item.term}
                      </h3>
                      <p className="mt-2 text-body text-text-secondary">
                        {item.definition}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
