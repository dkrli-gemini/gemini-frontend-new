import { create } from "zustand";

export interface ForwardRule {
  id: string;
  privateStart: string;
  privateEnd: string;
  publicStart: string;
  publicEnd: string;
  protocol: string;
  address: string;
  publicIpId: string;
  projectId: string;
}

export interface ForwardRuleState {
  rules: ForwardRule[];
  setRules: (rules: ForwardRule[]) => void;
}

export const useForwardRuleStore = create<ForwardRuleState>((set, get) => ({
  rules: [],
  setRules: (rules: ForwardRule[]) => set({ rules }),
}));
