import { create } from "zustand";

export enum ResourceTypeEnum {
  INSTANCES = "INSTANCES",
  CPU = "CPU",
  MEMORY = "MEMORY",
  VOLUMES = "VOLUMES",
  PUBLICIP = "PUBLICIP",
  NETWORK = "NETWORK",
  CPUCORES = "CPUCORES",
}

export interface Limit {
  id: string;
  type: ResourceTypeEnum;
  used: number;
  limit: number;
}

export interface LimitState {
  limits: Limit[];
  setLimits: (limits: Limit[]) => void;
}

export const useLimitStore = create<LimitState>((set, get) => ({
  limits: [],
  setLimits(limits: Limit[]) {
    set({ limits });
  },
}));
