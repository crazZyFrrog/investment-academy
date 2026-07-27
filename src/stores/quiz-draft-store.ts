import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type QuizDraft = {
  /** questionIndex → optionIndex */
  selected: Record<number, number>;
  checked: boolean;
};

interface QuizDraftState {
  drafts: Record<string, QuizDraft>;
  setAnswer: (
    quizId: string,
    questionIndex: number,
    optionIndex: number
  ) => void;
  setChecked: (quizId: string, checked: boolean) => void;
  clearQuiz: (quizId: string) => void;
  clearAll: () => void;
}

export const useQuizDraftStore = create<QuizDraftState>()(
  persist(
    (set) => ({
      drafts: {},
      setAnswer: (quizId, questionIndex, optionIndex) =>
        set((state) => {
          const current = state.drafts[quizId] ?? {
            selected: {},
            checked: false,
          };
          return {
            drafts: {
              ...state.drafts,
              [quizId]: {
                ...current,
                checked: false,
                selected: {
                  ...current.selected,
                  [questionIndex]: optionIndex,
                },
              },
            },
          };
        }),
      setChecked: (quizId, checked) =>
        set((state) => {
          const current = state.drafts[quizId] ?? {
            selected: {},
            checked: false,
          };
          return {
            drafts: {
              ...state.drafts,
              [quizId]: { ...current, checked },
            },
          };
        }),
      clearQuiz: (quizId) =>
        set((state) => {
          const next = { ...state.drafts };
          delete next[quizId];
          return { drafts: next };
        }),
      clearAll: () => set({ drafts: {} }),
    }),
    {
      name: "investment-academy-quiz-drafts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
