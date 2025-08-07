import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
}

export interface UserProject {
  id: string;
  userId: string;
  project: Project;
  domainName: string;
  domainId: string;
  role: string;
}

export interface UserProjectState {
  projects: UserProject[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  setProjects: (projects: UserProject[]) => void;
}

export const useProjectsStore = create<UserProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      setCurrentProjectId: (id: string | null) => {
        set({ currentProjectId: id });
      },
      setProjects: (projects: UserProject[]) => {
        set({ projects });
      },
    }),
    {
      name: "project-storage",
    }
  )
);
