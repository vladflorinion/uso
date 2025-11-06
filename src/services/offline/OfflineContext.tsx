import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_VERSION = 'v1';

export type OfflineContextValue = {
  isOnline: boolean;
  lastSyncedAt?: string;
  setLastSyncedAt: (value: string) => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncedAt, setLastSynced] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    AsyncStorage.getItem(`macropulse:lastSynced:${CACHE_VERSION}`).then((value) => {
      if (value) {
        setLastSynced(value);
      }
    });

    return () => unsubscribe();
  }, []);

  const setLastSyncedAt = async (value: string) => {
    setLastSynced(value);
    await AsyncStorage.setItem(`macropulse:lastSynced:${CACHE_VERSION}`, value);
  };

  const value = useMemo<OfflineContextValue>(
    () => ({ isOnline, lastSyncedAt, setLastSyncedAt }),
    [isOnline, lastSyncedAt],
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

export const useOffline = () => {
  const ctx = useContext(OfflineContext);
  if (!ctx) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return ctx;
};
