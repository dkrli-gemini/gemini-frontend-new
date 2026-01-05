import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./persist-storage";

export interface ChildrenProject {
  domainId: string;
  domainName: string;
}

interface ChildrenProjectState {
  childrenProjects: ChildrenProject[];
  setChildrenProjects: (projects: ChildrenProject[]) => void;
  clearChildrenProjects: () => void;
}

export const useChildrenProjectsStore = create<ChildrenProjectState>()(
  persist(
    (set) => ({
      childrenProjects: [],
      setChildrenProjects: (projects: ChildrenProject[]) => {
        set({ childrenProjects: projects });
      },
      clearChildrenProjects: () => set({ childrenProjects: [] }),
    }),
    {
      name: "children-projects-storage",
      storage: safeStorage,
    }
  )
);
