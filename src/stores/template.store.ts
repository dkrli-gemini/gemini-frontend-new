import { create } from "zustand";

export interface Template {
  id: string;
  name: string;
  url?: string;
}

interface TemplateState {
  templates: Template[];
  setTemplates: (templates: Template[]) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  setTemplates: (templates: Template[]) => set({ templates }),
}));
