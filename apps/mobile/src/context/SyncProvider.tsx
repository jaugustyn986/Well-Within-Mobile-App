import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { syncNow } from '../services/sync';
import { getStoredState } from '../services/storageV2';
import { useAuth } from './AuthProvider';

interface SyncContextValue {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function useSync(): SyncContextValue | null {
  return useContext(SyncContext);
}

export function SyncProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const auth = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const refreshSyncState = useCallback(async () => {
    const state = await getStoredState();
    setLastSyncedAt(state.lastSuccessfulSyncAt);
    setLastSyncError(state.lastSyncError);
  }, []);

  const doSyncNow = useCallback(async () => {
    const user = auth?.user;
    if (!user?.id) return;
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      const { error } = await syncNow(user.id);
      if (error) setLastSyncError(error);
      await refreshSyncState();
    } finally {
      setIsSyncing(false);
    }
  }, [auth?.user, refreshSyncState]);

  useEffect(() => {
    refreshSyncState();
  }, [refreshSyncState]);

  useEffect(() => {
    if (!auth?.user?.id) return;
    doSyncNow();
  }, [auth?.user?.id]);

  const triggerSync = useCallback(() => {
    void doSyncNow();
  }, [doSyncNow]);

  const value: SyncContextValue = {
    isSyncing,
    lastSyncedAt,
    lastSyncError,
    syncNow: triggerSync,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
