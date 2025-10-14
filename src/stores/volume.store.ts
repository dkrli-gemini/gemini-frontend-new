import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Volume {
  id: string;
  name: string;
  capacity: number;
  capacityString: string;
}

export interface VolumeState {
  volumes: Volume[];
  setVolumes: (input: Volume[]) => void;
}

export const useVolumeStore = create<VolumeState>((set, get) => ({
  volumes: [],
  setVolumes: (volumes: Volume[]) => {
    set({
      volumes: volumes.map((v) => {
        let capacityString = `${v.capacity} MB`;
        return {
          id: v.id,
          name: v.name,
          capacity: v.capacity,
          capacityString,
        };
      }),
    });
  },
}));
