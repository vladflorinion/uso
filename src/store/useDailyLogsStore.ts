import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyLog } from '@app-types/dailyLog';

const STORAGE_KEY = 'macropulse:dailyLogs';

type DailyLogState = {
  logs: Record<string, DailyLog>;
  setLog: (log: DailyLog) => void;
  removeLog: (date: string) => void;
  hydrate: (logs: DailyLog[]) => void;
};

type DailyLogsStoreCreator = StateCreator<DailyLogState, [['zustand/persist', unknown]], [], DailyLogState>;

const createDailyLogsStore: DailyLogsStoreCreator = (set) => ({
  logs: {},
  setLog: (log) =>
    set((state) => ({
      logs: {
        ...state.logs,
        [log.date]: log,
      },
    })),
  removeLog: (date) =>
    set((state) => {
      const next = { ...state.logs };
      delete next[date];
      return { logs: next };
    }),
  hydrate: (logs) =>
    set(() => ({
      logs: logs.reduce<Record<string, DailyLog>>((acc, curr) => {
        acc[curr.date] = curr;
        return acc;
      }, {}),
    })),
});

export const useDailyLogsStore = create<DailyLogState>()(
  persist(createDailyLogsStore, {
    name: STORAGE_KEY,
    getStorage: () => AsyncStorage,
  }),
);
