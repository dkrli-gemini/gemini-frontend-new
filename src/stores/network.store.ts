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
  error: null;
  fetched: boolean;
  fetchNetworks: (token: string, projectId: string) => Promise<void>;
  createNetwork: (
    token: string,
    projectId: string,
    name: string,
    gateway: string,
    netmask: string,
    aclId: string,
    offerId: string
  ) => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  networks: [],
  loading: false,
  error: null,
  fetched: false,
  createNetwork: async (
    token: string,
    projectId: string,
    name: string,
    gateway: string,
    netmask: string,
    aclId: string,
    offerId: string
  ) => {
    set({ loading: true, error: null });
    const response = await axios.post(
      `http://localhost:3003/network/add-network/${projectId}`,
      {
        name: name,
        gateway,
        netmask,
        cloudstackAclId: aclId,
        cloudstackOfferId: offerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  },
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
