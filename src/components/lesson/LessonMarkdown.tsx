"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const components = {
  Callout: ({
    children,
    type = "info",
  }: {
    children: React.ReactNode;
    type?: "info" | "warning" | "insight";
  }) => (
    <aside
      className={
        type === "warning"
          ? "my-6 border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3"
          : type === "insight"
            ? "my-6 border-l-4 border-primary bg-primary/10 px-4 py-3"
            : "my-6 border-l-4 border-border bg-muted/50 px-4 py-3"
      }
    >
      {children}
    </aside>
  ),
  Formula: ({ children }: { children: React.ReactNode }) => (
    <code className="my-4 block rounded-md bg-muted px-4 py-3 font-mono text-sm">
      {children}
    </code>
  ),
};

export function LessonMarkdown({
  source,
}: {
  source: MDXRemoteSerializeResult;
}) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </article>
  );
}
