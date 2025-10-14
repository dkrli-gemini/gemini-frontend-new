import { create } from "zustand";

export interface PublicIp {
  id: string;
  address: string;
}

export interface PublicIpState {
  ips: PublicIp[];
  setIps: (ips: PublicIp[]) => void;
}

export const usePublicIpStore = create<PublicIpState>((set, get) => ({
  ips: [],
  setIps: (ips: PublicIp[]) => {
    set({ ips });
  },
}));
