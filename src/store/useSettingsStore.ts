import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings } from '@app-types/settings';

const STORAGE_KEY = 'macropulse:userSettings';

const defaultSettings: UserSettings = {
  theme: 'dark',
  units: {
    weight: 'kg',
    hydration: 'L',
  },
  goals: {
    calories: 2000,
    protein: 150,
    carbs: 220,
    fat: 70,
    water: 3,
    steps: 10000,
  },
};

type SettingsState = {
  settings: UserSettings;
  setSettings: (next: UserSettings) => void;
};

type SettingsStoreCreator = StateCreator<SettingsState, [['zustand/persist', unknown]], [], SettingsState>;

const createSettingsStore: SettingsStoreCreator = (set) => ({
  settings: defaultSettings,
  setSettings: (next) => set({ settings: next }),
});

export const useSettingsStore = create<SettingsState>()(
  persist<SettingsState, [], [], Pick<SettingsState, 'settings'>>(createSettingsStore, {
    name: STORAGE_KEY,
    getStorage: () => AsyncStorage,
    partialize: (state) => ({ settings: state.settings }),
  }),
);
