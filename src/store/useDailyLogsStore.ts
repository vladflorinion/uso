import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { DailyLog } from '@types/dailyLog';

const STORAGE_KEY = 'macropulse:dailyLogs';

type DailyLogState = {
  logs: Record<string, DailyLog>;
  setLog: (log: DailyLog) => void;
  removeLog: (date: string) => void;
  hydrate: (logs: DailyLog[]) => void;
};

type MyPersist = (
  config: (set: any, get: any, api: any) => DailyLogState,
  options: PersistOptions<DailyLogState>,
) => (set: any, get: any, api: any) => DailyLogState;

export const useDailyLogsStore = create<DailyLogState>(
  (persist as MyPersist)(
    (set) => ({
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
    }),
    {
      name: STORAGE_KEY,
      getStorage: () => AsyncStorage,
    },
  ),
);
