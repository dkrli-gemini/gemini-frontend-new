import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Instance {
  id: string;
  name: string;
  cpu: string;
  memory: string;
  disk: string;
}

export interface Template {
  id: string;
  name: string;
}

export interface VirtualMachine {
  id: string;
  os: string;
  name: string;
  state: string;
  ipAddress: string;
  instance: Instance;
  template: Template;
}

export interface VMState {
  machines: VirtualMachine[];
  setMachines: (machines: VirtualMachine[]) => void;
  setMachineStatus: (machineId: string, status: string) => void;
}

export const useVMStore = create<VMState>()(
  persist(
    (set, get) => ({
      machines: [],
      setMachines: (machines: VirtualMachine[]) => set({ machines }),
      setMachineStatus: (machineId: string, status: string) =>
        set((state) => ({
          machines: state.machines.map((machine) =>
            machine.id === machineId ? { ...machine, state: status } : machine
          ),
        })),
    }),
    {
      name: "vm-storage",
    }
  )
);
