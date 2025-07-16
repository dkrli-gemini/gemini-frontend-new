import axios from "axios";
import { create } from "zustand";

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

export interface VirtualMachineState {
  machines: VirtualMachine[];
  consoleUrl: string | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchVirtualMachines: (token: string, projectId: string) => Promise<void>;
  startVirtualMachine: (
    token: string,
    machineId: string
  ) => Promise<string | undefined>;
  stopVirtualMachine: (
    token: string,
    machineId: string
  ) => Promise<string | undefined>;
  createVirtualMachine: (
    token: string,
    name: string,
    projectId: string,
    offerId: string,
    templateId: string,
    networkId: string
  ) => Promise<void>;
  fetchConsole: (token: string, machineId: string) => Promise<void>;
}

export const useVirtualMachineStore = create<VirtualMachineState>(
  (set, get) => ({
    machines: [],
    consoleUrl: null,
    loading: false,
    error: null,
    fetched: false,
    createVirtualMachine: async (
      token: string,
      name: string,
      projectId: string,
      offerId: string,
      templateId: string,
      networkId: string
    ) => {
      set({ loading: true, error: null });
      console.log(name, projectId, offerId, templateId, networkId);
      try {
        const response = await axios.post(
          `http://localhost:3003/projects/add-virtual-machine/${projectId}`,
          {
            name: name,
            cloudstackOfferId: offerId,
            cloudstackTemplateId: templateId,
            networkId: networkId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      } catch (e) {
        console.log(e);
      }
      set({ loading: false, error: null });
    },
    startVirtualMachine: async (
      token: string,
      machineId: string
    ): Promise<string | undefined> => {
      try {
        const response = await axios.post(
          `http://localhost:3003/machines/start-machine`,
          {
            machineId: machineId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.message.jobId;
      } catch (error) {
        console.log(error);
      }
    },
    stopVirtualMachine: async (
      token: string,
      machineId: string
    ): Promise<string | undefined> => {
      try {
        const response = await axios.post(
          `http://localhost:3003/machines/stop-machine`,
          {
            machineId: machineId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.message.jobId;
      } catch (error) {
        console.log(error);
      }
    },

    fetchConsole: async (token: string, machineId: string) => {
      console.log("fetch");
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
        console.log("Fetched machines:", machines);
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
            instance: {
              id: m.instance.id,
              name: m.instance.name,
              cpu: m.instance.cpu,
              memory: m.instance.memory,
              disk: m.instance.disk,
            },
          })),
        });
        console.log("Full API response message:", response.data.message);
      } catch (e: any) {
        console.error(
          "Error fetching virtual machines:",
          e.response?.data || e.message || e
        );
        set({
          loading: false,
          error: e.message || "An unknown error occurred",
        });
      }
    },
  })
);
