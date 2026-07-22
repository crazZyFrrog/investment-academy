"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LessonQuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type LessonQuizProps = {
  id: string;
  title?: string;
  /** JSON-строка массива вопросов — надёжно для MDX */
  data: string;
  /** Called once when the learner scores 100% after checking answers */
  onPassed?: (score: number) => void;
};

function parseItems(data: string): LessonQuizItem[] {
  try {
    const parsed = JSON.parse(data) as LessonQuizItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.question === "string" &&
        Array.isArray(item.options) &&
        typeof item.correctIndex === "number" &&
        typeof item.explanation === "string"
    );
  } catch {
    return [];
  }
}

export function LessonQuiz({
  id,
  title = "Проверьте себя",
  data,
  onPassed,
}: LessonQuizProps) {
  const items = useMemo(() => parseItems(data), [data]);
  const [selected, setSelected] = useState<Record<number, number | null>>({});
  const [checked, setChecked] = useState(false);

  if (items.length === 0) return null;

  const answeredCount = items.filter((_, i) => selected[i] != null).length;
  const allAnswered = answeredCount === items.length;
  const correctCount = checked
    ? items.filter((item, i) => selected[i] === item.correctIndex).length
    : 0;
  const passed = checked && correctCount === items.length;

  function reset() {
    setSelected({});
    setChecked(false);
  }

  function handleCheck() {
    setChecked(true);
    const correct = items.filter(
      (item, i) => selected[i] === item.correctIndex
    ).length;
    if (correct === items.length) {
      onPassed?.(100);
    }
  }

  return (
    <section
      aria-labelledby={`quiz-${id}-title`}
      className="mt-14 border-t border-border pt-10"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">
          Закрепление
        </p>
        <h2
          id={`quiz-${id}-title`}
          className="font-display text-xl tracking-tight text-text-primary sm:text-2xl"
        >
          {title}
        </h2>
        <p className="mt-2 text-[1.05rem] leading-relaxed text-text-secondary">
          Ответьте на все вопросы верно, чтобы отметить урок пройденным.
        </p>
      </div>

      <div className="space-y-8">
        {items.map((item, index) => {
          const choice = selected[index];
          const isCorrect = choice === item.correctIndex;

          return (
            <div
              key={`${id}-${index}`}
              className="rounded-[var(--radius-xl)] border border-border bg-surface-secondary/60 px-5 py-5"
            >
              <p className="mb-4 text-[1.05rem] leading-snug font-medium text-text-primary">
                <span className="mr-2 text-text-secondary">{index + 1}.</span>
                {item.question}
              </p>

              <div
                className="space-y-2"
                role="radiogroup"
                aria-label={`Вопрос ${index + 1}`}
              >
                {item.options.map((option, optionIndex) => {
                  const isSelected = choice === optionIndex;
                  const showResult = checked && isSelected;
                  const showCorrectMark =
                    checked && optionIndex === item.correctIndex;

                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={checked}
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [index]: optionIndex,
                        }))
                      }
                      className={cn(
                        "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-left text-[0.98rem] leading-snug transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        !checked &&
                          !isSelected &&
                          "border-border bg-surface text-text-primary hover:bg-muted",
                        !checked &&
                          isSelected &&
                          "border-primary/40 bg-primary/8 text-text-primary",
                        checked &&
                          showCorrectMark &&
                          "border-success/35 bg-success/10 text-text-primary",
                        checked &&
                          showResult &&
                          !isCorrect &&
                          "border-error/35 bg-error/10 text-text-primary",
                        checked &&
                          !showCorrectMark &&
                          !showResult &&
                          "border-border/70 bg-surface text-text-secondary opacity-80"
                      )}
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                        {showCorrectMark ? (
                          <Check className="size-4 text-success" aria-hidden />
                        ) : showResult && !isCorrect ? (
                          <X className="size-4 text-error" aria-hidden />
                        ) : (
                          <span
                            className={cn(
                              "size-3.5 rounded-full border",
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-border"
                            )}
                            aria-hidden
                          />
                        )}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {checked ? (
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {item.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!checked ? (
          <Button
            type="button"
            size="lg"
            disabled={!allAnswered}
            onClick={handleCheck}
          >
            Проверить ответы
          </Button>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-[1.05rem] text-text-primary">
              Результат:{" "}
              <span className="font-semibold">
                {correctCount} из {items.length}
              </span>
              {passed ? (
                <span className="ml-2 text-success">· тест сдан</span>
              ) : (
                <span className="ml-2 text-text-secondary">
                  · нужны все верные ответы
                </span>
              )}
            </p>
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw />
              Пройти ещё раз
            </Button>
          </div>
        )}

        {!checked ? (
          <p className="text-sm text-text-secondary">
            Отвечено {answeredCount} из {items.length}
          </p>
        ) : null}
      </div>
    </section>
  );
}
