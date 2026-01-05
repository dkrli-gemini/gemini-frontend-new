import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./persist-storage";

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
  currentDomainId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  setProjects: (projects: UserProject[]) => void;
  clearProjects: () => void;
}

export const useProjectsStore = create<UserProjectState>()(
  persist(
    (set, get) => ({
      clearProjects: () => {
        set({ projects: [], currentProjectId: null, currentDomainId: null });
      },
      projects: [],
      currentProjectId: null,
      currentDomainId: null,
      setCurrentProjectId: (id: string | null) => {
        const project = get().projects.find((p) => p.project.id === id) ?? null;
        set({
          currentProjectId: id,
          currentDomainId: project?.domainId ?? null,
        });
      },
      setProjects: (projects: UserProject[]) => {
        set((state) => {
          let currentProjectId = state.currentProjectId;
          let currentDomainId = state.currentDomainId;

          if (currentProjectId) {
            const byProjectId = projects.find(
              (p) => p.project.id === currentProjectId,
            );

            if (byProjectId) {
              currentDomainId = byProjectId.domainId;
            } else {
              const byDomainId = projects.find(
                (p) => p.domainId === currentProjectId,
              );
              if (byDomainId) {
                currentProjectId = byDomainId.project.id;
                currentDomainId = byDomainId.domainId;
              } else {
                currentProjectId = null;
                currentDomainId = null;
              }
            }
          }

          return {
            projects,
            currentProjectId,
            currentDomainId,
          };
        });
      },
    }),
    {
      name: "project-storage",
      storage: safeStorage,
    }
  )
);
