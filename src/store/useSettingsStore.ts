import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { UserSettings } from '@types/settings';

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

type MyPersist = (
  config: (set: any, get: any, api: any) => SettingsState,
  options: PersistOptions<SettingsState>,
) => (set: any, get: any, api: any) => SettingsState;

export const useSettingsStore = create<SettingsState>(
  (persist as MyPersist)(
    (set) => ({
      settings: defaultSettings,
      setSettings: (next) => set({ settings: next }),
    }),
    {
      name: STORAGE_KEY,
      getStorage: () => AsyncStorage,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
