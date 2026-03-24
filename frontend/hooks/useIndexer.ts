import { useState, useCallback } from 'react';
import {
  getTransfersByToken,
  getTransfersByAddress,
  getRecentTransfers,
  runAIQuery,
  type PaginationQuery,
} from '../lib/api';

export type { PaginationQuery as QueryOptions };

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
  createdAt?: string;
  updatedAt?: string;
}

/**
 * useIndexer — direct REST calls for known queries.
 * Only falls back to the AI endpoint for free-form natural language queries.
 * This avoids unnecessary OpenAI API calls (and cost) for structured lookups.
 */
export const useIndexer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransferEvent[]>([]);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetch transfers for a token contract — direct REST, no AI */
  const fetchByToken = useCallback(
    async (tokenAddress: string, options: PaginationQuery = {}) => {
      return withLoading(async () => {
        const result = await getTransfersByToken(tokenAddress, options);
        const transfers = (result.data ?? []) as unknown as TransferEvent[];
        setData(transfers);
        return transfers;
      });
    },
    [withLoading]
  );

  /** Fetch transfers for a wallet address — direct REST, no AI */
  const fetchByAddress = useCallback(
    async (address: string, options: PaginationQuery = {}) => {
      return withLoading(async () => {
        const result = await getTransfersByAddress(address, options);
        const transfers = (result.data ?? []) as unknown as TransferEvent[];
        setData(transfers);
        return transfers;
      });
    },
    [withLoading]
  );

  /** Fetch most recent transfers — direct REST, no AI */
  const fetchRecent = useCallback(
    async (options: PaginationQuery = {}) => {
      return withLoading(async () => {
        const result = await getRecentTransfers(options);
        const transfers = (result.data ?? []) as unknown as TransferEvent[];
        setData(transfers);
        return transfers;
      });
    },
    [withLoading]
  );

  /**
   * Free-form natural language query — uses the AI endpoint.
   * Only call this when the user types an arbitrary command.
   */
  const runNaturalLanguageQuery = useCallback(
    async (query: string) => {
      return withLoading(async () => {
        const result = await runAIQuery(query);
        if (result.success && Array.isArray(result.data)) {
          setData(result.data as TransferEvent[]);
        }
        return result;
      });
    },
    [withLoading]
  );

  return {
    isLoading,
    error,
    data,
    fetchByToken,
    fetchByAddress,
    fetchRecent,
    runNaturalLanguageQuery,
    // Legacy aliases kept for backward compatibility
    getTransfersByToken: fetchByToken,
    getTransfersByAddress: fetchByAddress,
    getRecentTransfers: fetchRecent,
  };
};

/** Kept for backward compatibility */
export function useIndexerControl() {
  const [isRunning] = useState(true);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  return { isRunning, loading, error, startIndexer: async () => {} };
}
