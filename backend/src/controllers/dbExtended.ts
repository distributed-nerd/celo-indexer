// dbExtended.ts — real DB-backed methods that were previously returning fake data
import TransferQueryService from './db';
import TransferEvent from '../models/TransferEvent';
import sequelize from '../config/sequilize';
import { QueryTypes } from 'sequelize';
import { QueryOptions } from '../types';

class ExtendedTransferQueryService {
  // Re-export base methods
  getTransfersByAddress = TransferQueryService.getTransfersByAddress.bind(TransferQueryService);
  getTransfersFrom = TransferQueryService.getTransfersFrom.bind(TransferQueryService);
  getTransfersTo = TransferQueryService.getTransfersTo.bind(TransferQueryService);
  getTransfersByToken = TransferQueryService.getTransfersByToken.bind(TransferQueryService);
  getTransfersByAddressAndToken = TransferQueryService.getTransfersByAddressAndToken.bind(TransferQueryService);
  getRecentTransfers = TransferQueryService.getRecentTransfers.bind(TransferQueryService);

  /**
   * Top token addresses by transfer volume (real aggregation)
   */
  async getTopTokens(limit = 10): Promise<{ tokenAddress: string; transferCount: number }[]> {
    const rows = await sequelize.query<{ tokenAddress: string; transferCount: string }>(
      `SELECT "tokenAddress", COUNT(*) AS "transferCount"
       FROM transfer_events
       GROUP BY "tokenAddress"
       ORDER BY "transferCount" DESC
       LIMIT :limit`,
      { replacements: { limit }, type: QueryTypes.SELECT }
    );
    return rows.map((r) => ({ tokenAddress: r.tokenAddress, transferCount: Number(r.transferCount) }));
  }

  /**
   * Top sender addresses by outgoing transfer count (real aggregation)
   */
  async getTopSenders(limit = 10): Promise<{ address: string; transferCount: number }[]> {
    const rows = await sequelize.query<{ from: string; transferCount: string }>(
      `SELECT "from", COUNT(*) AS "transferCount"
       FROM transfer_events
       GROUP BY "from"
       ORDER BY "transferCount" DESC
       LIMIT :limit`,
      { replacements: { limit }, type: QueryTypes.SELECT }
    );
    return rows.map((r) => ({ address: r.from, transferCount: Number(r.transferCount) }));
  }

  /**
   * Real aggregate stats from the database
   */
  async getStats(): Promise<{
    totalTransfers: number;
    uniqueTokens: number;
    uniqueSenders: number;
    uniqueReceivers: number;
    latestBlock: number | null;
  }> {
    const [[stats]] = await sequelize.query<{
      totalTransfers: string;
      uniqueTokens: string;
      uniqueSenders: string;
      uniqueReceivers: string;
      latestBlock: string | null;
    }>(
      `SELECT
         COUNT(*) AS "totalTransfers",
         COUNT(DISTINCT "tokenAddress") AS "uniqueTokens",
         COUNT(DISTINCT "from") AS "uniqueSenders",
         COUNT(DISTINCT "to") AS "uniqueReceivers",
         MAX("blockNumber") AS "latestBlock"
       FROM transfer_events`,
      { type: QueryTypes.SELECT }
    );

    return {
      totalTransfers: Number(stats.totalTransfers),
      uniqueTokens: Number(stats.uniqueTokens),
      uniqueSenders: Number(stats.uniqueSenders),
      uniqueReceivers: Number(stats.uniqueReceivers),
      latestBlock: stats.latestBlock !== null ? Number(stats.latestBlock) : null,
    };
  }
}

export default new ExtendedTransferQueryService();
