import { useState, useEffect, useCallback } from 'react';
import { getRecentTransfers, getStats } from '../lib/api';

export interface TransferEvent {
  id: number | string;
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  blockNumber: number;
  txHash: string;
  logIndex: number;
  timestamp: string | Date;
}

export interface IndexerStats {
  totalTransfers: number;
  uniqueTokens: number;
  uniqueSenders: number;
  uniqueReceivers: number;
  latestBlock: number | null;
}

/** Poll the indexer status endpoint */
export function useIndexerControl() {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [indexerError, setIndexerError] = useState<string | null>(null);

  const checkIndexerStatus = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/`);
      if (res.ok) {
        setIsRunning(true);
        setIndexerError(null);
      } else {
        setIsRunning(false);
      }
    } catch {
      setIsRunning(false);
      setIndexerError('Cannot reach indexer backend');
    }
  }, []);

  useEffect(() => {
    checkIndexerStatus();
    const id = setInterval(checkIndexerStatus, 30_000);
    return () => clearInterval(id);
  }, [checkIndexerStatus]);

  return { isRunning, indexerError, checkIndexerStatus };
}

/** Fetch recent transfers from the real backend */
export function useRecentTransactions(limit = 10) {
  const [transactions, setTransactions] = useState<TransferEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecentTransfers({ limit });
      if (result.success) {
        setTransactions(result.data as unknown as TransferEvent[]);
      } else {
        setError(result.error ?? 'Failed to fetch transactions');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      console.error('Failed to fetch recent transactions:', msg);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  return { transactions, loading, error, refreshTransactions };
}

/** Fetch real aggregate stats from the backend */
export function useIndexerStats() {
  const [stats, setStats] = useState<IndexerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError('Failed to fetch stats');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      console.error('Failed to fetch indexer stats:', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, loading, error, refreshStats };
}

// Keep useRecentBlocks exported for backward compat — returns empty until
// a dedicated blocks endpoint is implemented on the backend
export function useRecentBlocks(_limit = 10) {
  return { blocks: [], loading: false, refreshBlocks: async () => {} };
}
