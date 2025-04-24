import axios from "axios";
import { headers } from "next/headers";
import { create } from "zustand";

export interface Network {
  id: string;
  name: string;
  cloudstackId: string;
  gateway: string;
  netmask: string;
}

export interface NetworkState {
  networks: Network[];
  loading: boolean;
  error: null;
  fetched: boolean;
  fetchNetworks: (token: string, projectId: string) => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  networks: [],
  loading: false,
  error: null,
  fetched: false,
  fetchNetworks: async (token: string, projectId: string) => {
    if (get().loading == true) return;
    set({ loading: true, error: null });
    if (get().fetched == true) {
      set({ loading: false, error: null });
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3003/projects/list-networks/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (e) {}
  },
}));
