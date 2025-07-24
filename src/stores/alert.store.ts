import { create } from 'zustand';

interface AlertState {
  message: string | null;
  isVisible: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  showAlert: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: null,
  isVisible: false,
  type: 'info',
  showAlert: (message, type = 'info') => set({ message, isVisible: true, type }),
  hideAlert: () => set({ message: null, isVisible: false }),
}));
