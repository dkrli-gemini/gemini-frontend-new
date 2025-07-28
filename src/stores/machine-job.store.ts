import { create } from 'zustand';

interface MachineJobState {
  jobs: { [machineId: string]: { isStarting: boolean; isStopping: boolean; jobId: string | null } };
  setJobState: (machineId: string, state: { isStarting?: boolean; isStopping?: boolean; jobId?: string | null }) => void;
}

export const useMachineJobStore = create<MachineJobState>((set) => ({
  jobs: {},
  setJobState: (machineId, state) =>
    set((prev) => ({
      jobs: {
        ...prev.jobs,
        [machineId]: {
          ...prev.jobs[machineId],
          ...state,
        },
      },
    })),
}));
