import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Instance {
  id: string;
  name: string;
  cpu: string;
  memory: string;
  disk: string;
}

export interface VirtualMachine {
  id: string;
  os: string;
  name: string;
  state: string;
  ipAddress: string;
  instance: Instance;
}

export interface VMState {
  machines: VirtualMachine[];
  setMachines: (machines: VirtualMachine[]) => void;
}

export const useVMStore = create<VMState>()(
  persist(
    (set, get) => ({
      machines: [],
      setMachines: (machines: VirtualMachine[]) => set({ machines }),
    }),
    {
      name: "vm-storage",
    }
  )
);
