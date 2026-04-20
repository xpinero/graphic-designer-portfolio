import { create } from 'zustand';

interface SettingsStore {
  shopEnabled: boolean;
  manualShopEnabled: boolean;
  scheduledClosureActive: boolean;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  toggleShop: (password: string) => Promise<boolean>;
  setShopEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  shopEnabled: true,
  manualShopEnabled: true,
  scheduledClosureActive: false,
  isLoading: true,

  fetchSettings: async () => {
    try {
      const response = await fetch('/api/settings', { cache: 'no-store' });
      const data = await response.json();
      set({
        shopEnabled: data.shopEnabled,
        manualShopEnabled: data.manualShopEnabled,
        scheduledClosureActive: data.scheduledClosureActive,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ isLoading: false });
    }
  },

  toggleShop: async (password: string) => {
    const nextManual = !get().manualShopEnabled;
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopEnabled: nextManual,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      set({
        shopEnabled: data.shopEnabled,
        manualShopEnabled: data.manualShopEnabled,
        scheduledClosureActive: data.scheduledClosureActive,
      });
      return true;
    } catch (error) {
      console.error('Failed to toggle shop:', error);
      return false;
    }
  },

  setShopEnabled: (enabled) => set({ shopEnabled: enabled }),
}));
