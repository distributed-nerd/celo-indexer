import TransferEvent from '../models/TransferEvent';
import { Op } from 'sequelize';
import { QueryOptions } from '../types';

const DEFAULT_OPTS: Required<QueryOptions> = {
  limit: 100,
  offset: 0,
  sortBy: 'timestamp',
  sortDir: 'DESC',
};

function resolveOpts(options: QueryOptions): Required<QueryOptions> {
  return { ...DEFAULT_OPTS, ...options };
}

class TransferQueryService {
  /** All transfers involving an address (sent or received) */
  async getTransfersByAddress(address: string, options: QueryOptions = {}): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    const addr = address.toLowerCase();
    return TransferEvent.findAll({
      where: { [Op.or]: [{ from: addr }, { to: addr }] },
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Transfers sent from an address */
  async getTransfersFrom(address: string, options: QueryOptions = {}): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    return TransferEvent.findAll({
      where: { from: address.toLowerCase() },
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Transfers received by an address */
  async getTransfersTo(address: string, options: QueryOptions = {}): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    return TransferEvent.findAll({
      where: { to: address.toLowerCase() },
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Transfers for a specific token contract */
  async getTransfersByToken(tokenAddress: string, options: QueryOptions = {}): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    return TransferEvent.findAll({
      where: { tokenAddress: tokenAddress.toLowerCase() },
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Transfers for a specific address filtered by token */
  async getTransfersByAddressAndToken(
    address: string,
    tokenAddress: string,
    options: QueryOptions = {}
  ): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    const addr = address.toLowerCase();
    return TransferEvent.findAll({
      where: {
        [Op.or]: [{ from: addr }, { to: addr }],
        tokenAddress: tokenAddress.toLowerCase(),
      },
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Most recent transfers regardless of address */
  async getRecentTransfers(options: QueryOptions = {}): Promise<any[]> {
    const { limit, offset, sortBy, sortDir } = resolveOpts(options);
    return TransferEvent.findAll({
      order: [[sortBy, sortDir]],
      limit,
      offset,
    });
  }

  /** Total count of indexed transfers */
  async getTotalCount(): Promise<number> {
    return TransferEvent.count();
  }
}

export default new TransferQueryService();
