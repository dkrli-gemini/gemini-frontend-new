import { create } from "zustand";
import axios from "axios";

export interface Domain {
  id: string;
  rootProjectId: string;
  name: string;
}

interface DomainState {
  domain: Domain | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchDomains: (token: string, domainId: string) => Promise<void>;
}

export const useDomainStore = create<DomainState>((set, get) => ({
  domain: null,
  loading: false,
  error: null,
  fetched: false,
  fetchDomains: async (token: string, domainId: string) => {
    if (get().loading == true) return;
    set({ loading: true, error: null });
    if (get().fetched == true) {
      set({ loading: false, error: null });
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3003/domain/${domainId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const domain = response.data.message;
      set({
        loading: false,
        error: null,
        domain: {
          id: domain.id,
          name: domain.name,
          rootProjectId: domain.rootProjectId,
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  },
}));
