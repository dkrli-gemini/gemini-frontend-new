import axios from "axios";
import { create } from "zustand";

export interface VirtualMachine {
  id: string;
  os: string;
  name: string;
  state: string;
  ipAddress: string;
}

export interface VirtualMachineState {
  machines: VirtualMachine[];
  consoleUrl: string | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchVirtualMachines: (token: string, projectId: string) => Promise<void>;
  fetchConsole: (token: string, machineId: string) => Promise<void>;
}

export const useVirtualMachineStore = create<VirtualMachineState>(
  (set, get) => ({
    machines: [],
    consoleUrl: null,
    loading: false,
    error: null,
    fetched: false,
    fetchConsole: async (token: string, machineId: string) => {
      const response = await axios.get(
        `http://localhost:3003/machines/console/${machineId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      const url = response.data.message.consoleUrl;
      set({
        consoleUrl: url,
      });
    },
    fetchVirtualMachines: async (token: string, projectId: string) => {
      if (get().loading == true) return;
      set({ loading: true, error: null });
      if (get().fetched == true) {
        set({ loading: false, error: null });
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3003/projects/list-machines/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const machines = response.data.message.machines;
        set({
          loading: false,
          error: null,
          fetched: true,
          machines: machines.map((m: any) => ({
            id: m.id,
            name: m.name,
            os: m.os,
            ipAddress: m.ipAddress,
            state: m.state,
          })),
        });
        console.log(response.data.message);
      } catch (e) {
        console.log(e);
      }
    },
  })
);
