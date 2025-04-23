import axios from "axios";
import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
}

export interface DomainMember {
  id: string;
  userId: string;
  project: Project;
  role: string;
}

export interface DomainMemberState {
  members: DomainMember[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchDomainMembers: (token: string) => Promise<void>;
}

export const useDomainMemberStore = create<DomainMemberState>((set, get) => ({
  members: [],
  loading: false,
  error: null,
  fetched: false,
  fetchDomainMembers: async (token: string) => {
    if (get().loading == true) return;
    set({ loading: true, error: null });
    if (get().fetched == true) {
      set({ loading: false, error: null });
      return;
    }
    try {
      const response = await axios.get("http://localhost:3003/users/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const domainMembers = response.data.message.projects;
      set({
        loading: false,
        error: null,
        fetched: true,
        members: domainMembers.map((member: any) => ({
          id: member.id,
          project: {
            id: member.project.id,
            name: member.project.name,
          },
          role: member.role,
          userId: member.userId,
        })),
      });
    } catch (e) {
      console.log(e);
    }
  },
}));
