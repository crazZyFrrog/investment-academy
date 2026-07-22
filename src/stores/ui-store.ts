import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  onboardingComplete: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: UiState["theme"]) => void;
  completeOnboarding: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "system",
      onboardingComplete: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    {
      name: "investment-academy-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
