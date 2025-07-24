import axios from "axios";
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
  error: string | null;
  fetched: boolean;
  fetchNetworks: (token: string, projectId: string) => Promise<void>;
  
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  networks: [],
  loading: false,
  error: null,
  fetched: false,
  
  fetchNetworks: async (token: string, projectId: string) => {
    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `http://localhost:3003/projects/list-networks/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const networks = response.data.message.networks;
      set({
        error: null,
        loading: false,
        fetched: true,
        networks: networks.map((n: any) => ({
          id: n.id,
          name: n.name,
          cloudstackId: n.cloudstackId,
          gateway: n.gateway,
          netmask: n.netmask,
        })),
      });
    } catch (e) {}
  },
}));
