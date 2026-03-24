// frontend/lib/api.ts
// Unified API client that always calls the real backend.
// The mock-data short-circuit that blocked real calls in development has been removed.

import axios from 'axios';
import type { TokenTransfer, NetworkStats } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface PaginationQuery {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface TransferResponse {
  success: boolean;
  data: TokenTransfer[];
  count: number;
  error?: string;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalTransfers: number;
    uniqueTokens: number;
    uniqueSenders: number;
    uniqueReceivers: number;
    latestBlock: number | null;
  };
}

/** GET /api/transfers/recent */
export async function getRecentTransfers(params: PaginationQuery = {}): Promise<TransferResponse> {
  const { data } = await client.get('/api/transfers/recent', { params });
  return data;
}

/** GET /api/transfers/:address */
export async function getTransfersByAddress(
  address: string,
  params: PaginationQuery = {}
): Promise<TransferResponse> {
  const { data } = await client.get(`/api/transfers/${address}`, { params });
  return data;
}

/** GET /api/transfers/:address/from */
export async function getTransfersFrom(
  address: string,
  params: PaginationQuery = {}
): Promise<TransferResponse> {
  const { data } = await client.get(`/api/transfers/${address}/from`, { params });
  return data;
}

/** GET /api/transfers/:address/to */
export async function getTransfersTo(
  address: string,
  params: PaginationQuery = {}
): Promise<TransferResponse> {
  const { data } = await client.get(`/api/transfers/${address}/to`, { params });
  return data;
}

/** GET /api/baseindex/:tokenAddress */
export async function getTransfersByToken(
  tokenAddress: string,
  params: PaginationQuery = {}
): Promise<TransferResponse> {
  const { data } = await client.get(`/api/baseindex/${tokenAddress}`, { params });
  return data;
}

/** GET /api/addresses/:address/tokens/:tokenAddress/transfers */
export async function getTransfersByAddressAndToken(
  address: string,
  tokenAddress: string,
  params: PaginationQuery = {}
): Promise<TransferResponse> {
  const { data } = await client.get(
    `/api/addresses/${address}/tokens/${tokenAddress}/transfers`,
    { params }
  );
  return data;
}

/** GET /api/stats */
export async function getStats(): Promise<StatsResponse> {
  const { data } = await client.get('/api/stats');
  return data;
}

/** POST /indexer/run — AI natural language query */
export async function runAIQuery(userMessage: string): Promise<any> {
  const { data } = await client.post('/indexer/run', { userMessage });
  return data;
}
