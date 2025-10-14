import axios from "axios";
import { create } from "zustand";

export interface Network {
  id: string;
  name: string;
  gateway: string;
  netmask: string;
  aclId: string;
  aclName: string;
}

export interface NetworkState {
  networks: Network[];
  setNetworks: (networks: Network[]) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  networks: [],
  setNetworks(networks: Network[]) {
    set({ networks });
  },
}));
