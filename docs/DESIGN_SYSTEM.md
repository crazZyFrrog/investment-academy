# Design System — Investment Academy

Reusable UI foundation for a **premium educational product**.

**Scope:** tokens, colors, typography, primitives, motion, icons.  
**Out of scope:** application screens, routing, business logic, auth flows, mock content.

Inspiration (do not copy): Apple HIG, Linear, Raycast, Notion, Arc Browser.

---

## Design principles

| Principle | What it means here |
|-----------|--------------------|
| **Minimalistic** | Few chrome elements. One job per section. No decorative clutter. |
| **Spacious** | Generous padding and gaps (`6`–`12` on the spacing scale). Let lessons breathe. |
| **Large radius** | Controls `lg` (16px), cards `xl` (20px), empty states `2xl` (24px). Soft geometry. |
| **Soft shadows** | Barely-there elevation. Prefer border + surface contrast over heavy drops. |
| **Excellent typography** | Fraunces for display/headings, Source Sans 3 for body. Tight tracking on titles, relaxed reading measure. |
| **Smooth subtle motion** | Short, ease-out transitions. Presence only — no ambient loops. Respect `prefers-reduced-motion`. |
| **Desaturated color** | Muted sage primary, slate accent. No neon, no bright fills. |
| **No gradients** | Flat surfaces only. `.hero-surface` is solid `background`. |
| **No skeuomorphism / glassmorphism** | No faux materials, blur stacks, or frosted glass. |
| **Accessibility first** | `:focus-visible` rings, contrast-aware roles, reduced-motion gates, semantic HTML via `Typography`/`as`. |
| **Mobile-first** | Compact type steps down on small viewports; containers pad from `px-5` up. |
| **Composition over configuration** | Prefer nesting `CardHeader` / `Typography` / icons over giant prop APIs. |
| **Scalable to hundreds of lessons** | Tokens + semantic roles + list-friendly primitives (Chip, Tag, Badge, Progress) stay stable as catalog grows. |

Every component should feel **calm, focused, and premium**.

---

## Folder map

```text
src/design-system/
  tokens/          # TS token maps
  typography/      # Typography component
  theme/           # ThemeProvider + useTheme
  motion/          # Framer helpers (reduced-motion aware)
  icons/           # Central Lucide exports
  index.ts

src/styles/globals.css
src/components/ui/       # Visual primitives
docs/DESIGN_SYSTEM.md
```

---

## 1. Tokens

| Group | Decision |
|-------|----------|
| **Spacing** | 4px base, extended to `32` (128px) for sparse layouts. Prefer whitespace over denser chrome. |
| **Radius** | Larger than typical dashboards: `sm` 8 → `2xl` 24. Educational UI should feel approachable, not sharp. |
| **Shadows** | Low-opacity, short blur. Cards default to `xs`; hover may lift to `sm`. |
| **Motion** | 150–360ms for UI; Apple-like cubic-bezier. Framer helpers no-op when reduced motion is preferred. |
| **Z-index** | Named layers only — predictable stacking for shell, modal, toast. |
| **Breakpoints** | Tailwind `sm`–`2xl`, mobile-first. |

---

## 2. Color system

### Semantic roles

`background` · `surface` · `surfaceSecondary` · `primary` · `secondary` · `accent` · `success` · `warning` · `error` · `textPrimary` · `textSecondary` · `textTertiary` · `border` · `muted` · `ring` · `input`

### Palette intent

- **Light:** warm-neutral canvas `#f6f6f4`, pure white surfaces, desaturated sage primary `#3d5c52`, slate accent `#4d5c66`.
- **Dark:** near-black `#111111`, quiet surfaces `#1a1a1a`, lifted sage/slate for readability — not neon teal.

Status colors are muted on purpose so a catalog of hundreds of lessons does not become a Christmas tree of badges.

**Never** hardcode hex in components. Use `bg-surface`, `text-text-secondary`, `bg-primary/8`, etc.

Theme: `ThemeProvider` sets `.light` / `.dark` on `<html>`; `system` follows `prefers-color-scheme`.

---

## 3. Typography

| Role | Use |
|------|-----|
| Display | Rare hero / brand moments |
| Heading 1–3 | Screen and section structure |
| Title | Card and list-item titles (scalable for long lesson lists) |
| Body | Lesson prose — relaxed line-height |
| Caption | Meta (duration, XP, sync) |
| Label | Quiet uppercase eyebrows |
| Code | Formulas / snippets |

Component: `Typography` with `variant` + optional `as` for correct semantics.

---

## 4. UI primitives

Compose screens from these — do not invent parallel systems.

| Primitive | Notes |
|-----------|--------|
| Button | Few variants (default, secondary, outline, ghost, destructive, link). Large radius, soft press. |
| Card | Spacious padding slots via composition. `interactive` = subtle lift, not glow. |
| Badge / Tag / Chip | Soft fills by default. Chip for filters; Tag for static meta; Badge for status. |
| Progress | Thin, muted track — calm progress for long curricula. |
| SectionHeader | Eyebrow + title + description + action. One job per section. |
| ScreenContainer | Shared max-width + padding. Default `xl` / spacious `md` padding. |
| EmptyState | Centered, large radius, soft surface — empty catalog / progress. |
| Skeleton | Pulse loading; disabled under reduced motion. |
| Divider | Structural only. |
| CourseDifficultyBadge / DurationBadge | Presentational meta for lesson scale. |

**Composition over configuration:** pass children and nest primitives instead of adding one-off boolean props for every layout case.

---

## 5. Motion

Helpers in `@/design-system/motion`:

- `PageTransition` · `FadeIn` · `SlideUp` · `CardHover` · `ButtonPress`

Travel distances are small (6–12px). Helpers render static markup when `prefers-reduced-motion` is set. Global CSS also collapses transitions.

---

## 6. Icons

Import only from `@/design-system/icons`. Keeps the set intentional as the lesson catalog grows.

---

## 7. Anti-patterns (explicit)

| Avoid | Why |
|-------|-----|
| Gradients / mesh backgrounds | Breaks calm flat language |
| Glass / blur chrome | Visual noise, a11y/contrast issues |
| Bright saturated CTAs | Anxiety, not education |
| Dense prop-driven “mega components” | Hurts scalability across hundreds of lessons |
| Ad-hoc spacing / radius | Breaks rhythm |
| Ambient looping animations | Distracts from learning |

---

## 8. Usage sketch

```tsx
import { Typography, FadeIn, BookOpen } from "@/design-system";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CourseDifficultyBadge,
  DurationBadge,
  Progress,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";

export function Example() {
  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Curriculum"
        title="Investing Fundamentals"
        description="Build durable market intuition."
        action={<Button>Continue</Button>}
      />
      <FadeIn>
        <Card interactive>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <CourseDifficultyBadge difficulty="beginner" />
              <DurationBadge minutes={45} />
            </div>
            <CardTitle>What Is Investing?</CardTitle>
            <CardDescription>Foundations for long-term thinking.</CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7">
            <Progress value={40} showValue label="Progress" />
            <BookOpen className="size-5 text-text-tertiary" />
          </div>
        </Card>
      </FadeIn>
    </ScreenContainer>
  );
}
```

---

## Compatibility

- Existing academy screens keep working; primitives were refined in place.
- Legacy `.hero-surface` is now a **flat** background (no gradient).
- shadcn aliases (`--card`, `--destructive`) map to semantic roles.
