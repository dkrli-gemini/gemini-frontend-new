import axios from "axios";
import { createContext, useRef, useContext, Context } from "react";
import { create, StoreApi, UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface JobState {
  jobId: string | null;
  status: "NONE" | "PENDING" | "DONE" | string;
  error: string | null;
  isPolling: boolean;
  token: string | null;
  startJob: (jobId: string, token: string) => Promise<void>;
  pollStatus: () => Promise<void>;
  reset: () => void;
}

export const createJobStore = () =>
  create<JobState>()((set, get) => ({
    jobId: null,
    status: "NONE",
    token: null,
    error: null,
    isPolling: false,

    startJob: async (jobId: string, token: string): Promise<void> => {
      set({
        status: "PENDING",
        isPolling: true,
        jobId: jobId,
        token: token,
      });
      get().pollStatus();
    },
    pollStatus: async (): Promise<void> => {
      if (!get().jobId || !get().isPolling) return;
      try {
        const response = await axios.get(
          `http://localhost:3003/jobs/status/${get().jobId}`,
          {
            headers: {
              Authorization: `Bearer ${get().token}`,
            },
          }
        );
        set({ status: response.data.message.status });
        if (get().status != "DONE") {
          setTimeout(get().pollStatus, 3000);
        } else {
          set({ isPolling: false });
        }
      } catch (err: any) {
        set({ status: "failed", error: err.message, isPolling: false });
      }
    },
    reset: () => {
      set({
        jobId: null,
        status: "NONE",
        error: null,
        isPolling: false,
      });
    },
  }));

type JobStoreHook = UseBoundStore<StoreApi<JobState>>;

const JobStoreContext: Context<JobStoreHook | null> =
  createContext<JobStoreHook | null>(null);

export const JobStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storeHookRef = useRef<JobStoreHook | null>(null);

  if (!storeHookRef.current) {
    storeHookRef.current = createJobStore();
  }

  return (
    // Provide the Zustand store hook to children
    <JobStoreContext.Provider value={storeHookRef.current}>
      {children}
    </JobStoreContext.Provider>
  );
};

export const useJobStore = () => {
  const storeHook = useContext(JobStoreContext);
  if (!storeHook) {
    throw new Error("useJobStore must be used with its repective provider");
  }

  return storeHook();
};
