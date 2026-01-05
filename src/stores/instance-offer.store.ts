import { create } from "zustand";

export interface InstanceOffer {
  id: string;
  name: string;
  sku?: string;
  family?: string;
  profile?: string;
  cpuNumber: number;
  cpuSpeedMhz: number;
  memoryInMb: number;
  rootDiskSizeInGb: number;
  diskTier?: string;
}

interface InstanceOfferState {
  offers: InstanceOffer[];
  setOffers: (offers: InstanceOffer[]) => void;
}

export const useInstanceOfferStore = create<InstanceOfferState>((set) => ({
  offers: [],
  setOffers: (offers: InstanceOffer[]) => set({ offers }),
}));
