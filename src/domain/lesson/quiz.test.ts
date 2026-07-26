import { describe, expect, it } from "vitest";
import { parseLessonQuizData } from "@/domain/lesson/quiz";

describe("parseLessonQuizData", () => {
  it("accepts a valid quiz payload", () => {
    const data = JSON.stringify([
      {
        question: "Что такое риск?",
        options: ["A", "B"],
        correctIndex: 0,
        explanation: "Потому что",
      },
    ]);
    expect(parseLessonQuizData(data)).toHaveLength(1);
  });

  it("rejects out-of-range correctIndex", () => {
    const data = JSON.stringify([
      {
        question: "Q",
        options: ["A", "B"],
        correctIndex: 5,
        explanation: "E",
      },
    ]);
    expect(parseLessonQuizData(data)).toEqual([]);
  });

  it("rejects invalid JSON", () => {
    expect(parseLessonQuizData("{not-json")).toEqual([]);
  });
});
