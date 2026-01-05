import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./persist-storage";

export interface AclRule {
  id: string;
  cidr: string;
  startPort: string;
  endPort: string;
  action: string;
  trafficType: string;
  protocol: string;
}

export interface AclList {
  rules: AclRule[];
  id: string;
  name: string;
  description: string;
}

export interface AclState {
  acls: AclList[];
  setAcl: (input: AclList[]) => void;
}

export const useAclStore = create<AclState>()(
  persist(
    (set, get) => ({
      acls: [],
      setAcl: (acls: AclList[]) => set({ acls }),
    }),
    {
      name: "acl-storage",
      storage: safeStorage,
    }
  )
);
