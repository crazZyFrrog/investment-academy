"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { LessonQuiz } from "@/components/lesson/LessonQuiz";
import { cn } from "@/lib/utils";

function Callout({
  children,
  type = "info",
}: {
  children: ReactNode;
  type?: "info" | "warning" | "insight";
}) {
  return (
    <aside
      className={cn(
        "my-8 rounded-[var(--radius-xl)] border px-5 py-4 text-[1.05rem] leading-relaxed",
        type === "warning" &&
          "border-warning/25 bg-warning/[0.07] text-text-primary",
        type === "insight" &&
          "border-primary/20 bg-primary/[0.05] text-text-primary",
        type === "info" && "border-border bg-surface-secondary text-text-primary"
      )}
    >
      {children}
    </aside>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <code className="my-8 block overflow-x-auto rounded-[var(--radius-xl)] border border-border bg-surface px-5 py-4 font-mono text-sm leading-relaxed text-text-primary shadow-xs">
      {children}
    </code>
  );
}

const baseComponents = {
  Callout,
  Formula,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-10 mb-4 font-display text-xl tracking-tight text-text-primary sm:text-2xl"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-8 mb-3 font-display text-lg tracking-tight text-text-primary"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mb-5 text-[1.05rem] leading-[1.75] text-text-primary"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mb-5 list-disc space-y-2 pl-5 text-[1.05rem] leading-relaxed text-text-primary"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-5 list-decimal space-y-2 pl-5 text-[1.05rem] leading-relaxed text-text-primary"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto">
      <table
        className="w-full min-w-[28rem] border-collapse text-left text-[0.98rem]"
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border text-text-secondary" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-3 py-2 font-medium" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-border/70 px-3 py-2.5 text-text-primary" {...props} />
  ),
};

/** Survives React Strict Mode remount so MDX does not flash unmount in tests/dev. */
let mdxClientReady = false;

export function LessonMarkdown({
  source,
  onQuizPassed,
}: {
  source: MDXRemoteSerializeResult;
  onQuizPassed?: (score: number) => void;
}) {
  // MDXRemote calls useState during SSR; under Next 16 / React 19 that throws
  // (dispatcher null) and can blank the lesson page. Mount content only on client.
  const [mounted, setMounted] = useState(mdxClientReady);
  useEffect(() => {
    mdxClientReady = true;
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const components = {
    ...baseComponents,
    LessonQuiz: (props: {
      id: string;
      title?: string;
      data: string;
    }) => <LessonQuiz {...props} onPassed={onQuizPassed} />,
  };

  if (!mounted) {
    return (
      <article className="max-w-none" aria-busy>
        <p className="text-caption text-text-secondary" aria-live="polite">
          Загружаем текст урока…
        </p>
      </article>
    );
  }

  return (
    <article className="max-w-none">
      <MDXRemote {...source} components={components} />
    </article>
  );
}
