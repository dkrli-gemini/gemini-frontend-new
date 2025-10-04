import { create } from 'zustand';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | '';
  show: boolean;
  showNotification: (message: string, type: 'success' | 'error') => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: '',
  type: '',
  show: false,
  showNotification: (message, type) => set({ message, type, show: true }),
  hideNotification: () => set({ show: false }),
}));