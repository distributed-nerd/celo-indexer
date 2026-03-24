// Shared types used across controllers, services, and routes

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface TransferEventData {
  id?: number;
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  blockNumber: number;
  txHash: string;
  logIndex: number;
  timestamp: Date;
}

export interface APISuccessResponse<T> {
  success: true;
  data: T;
  count?: number;
}

export interface APIErrorResponse {
  success: false;
  message: string;
  queryType?: string;
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export function parseQueryOptions(query: Record<string, any>): QueryOptions {
  let sortDir: 'ASC' | 'DESC' | undefined;

  if (typeof query.sortDir === 'string') {
    const dir = query.sortDir.toUpperCase();
    if (dir === 'ASC' || dir === 'DESC') {
      sortDir = dir;
    }
  }

  return {
    limit: query.limit ? parseInt(query.limit, 10) : 100,
    offset: query.offset ? parseInt(query.offset, 10) : 0,
    sortBy: typeof query.sortBy === 'string' ? query.sortBy : 'timestamp',
    sortDir,
  };
}
