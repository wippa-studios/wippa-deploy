import { create } from 'zustand';

type AiSidebarView = 'chat' | 'diagnosis';

type AiSidebarState = {
  isOpen: boolean;
  view: AiSidebarView;
  diagnosisContext: {
    stepName: string;
    errorMessage: string;
    flowName: string;
  } | null;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setView: (view: AiSidebarView) => void;
  setDiagnosisContext: (context: { stepName: string; errorMessage: string; flowName: string } | null) => void;
};

export const useAiSidebarStore = create<AiSidebarState>((set) => ({
  isOpen: false,
  view: 'chat',
  diagnosisContext: null,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
  setDiagnosisContext: (context) => set({
    diagnosisContext: context,
    view: context ? 'diagnosis' : 'chat',
    isOpen: true,
  }),
}));
