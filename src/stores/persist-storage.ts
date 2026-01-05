import { StateStorage, createJSONStorage } from "zustand/middleware";

// Provides a safe storage implementation that falls back to a no-op store
// during SSR so persist doesn't crash when localStorage is unavailable.
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const safeStorage = createJSONStorage(() =>
  typeof window === "undefined" ? noopStorage : localStorage
);
