import { create } from "zustand";

interface QuizDraftState {
  answers: Record<string, string>;
  setAnswer: (quizId: string, answer: string) => void;
  clearQuiz: (quizId: string) => void;
}

export const useQuizDraftStore = create<QuizDraftState>((set) => ({
  answers: {},
  setAnswer: (quizId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [quizId]: answer },
    })),
  clearQuiz: (quizId) =>
    set((state) => {
      const next = { ...state.answers };
      delete next[quizId];
      return { answers: next };
    }),
}));
