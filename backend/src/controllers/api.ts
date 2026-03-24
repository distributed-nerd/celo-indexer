import express, { Request, Response } from 'express';
import TransferQueryService from './db';
import { parseQueryOptions } from '../types';
import { validateAccount } from '../utils/validateAddress';

const router = express.Router();

/** Validate an Ethereum address param and return 400 if invalid */
function requireValidAddress(address: string, res: Response): boolean {
  if (!validateAccount(address)) {
    res.status(400).json({ success: false, error: `Invalid Ethereum address: ${address}` });
    return false;
  }
  return true;
}

/**
 * GET /api/transfers/:address
 * All transfers involving an address (sent or received)
 */
router.get('/transfers/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  if (!requireValidAddress(address, res)) return;
  try {
    const transfers = await TransferQueryService.getTransfersByAddress(address, parseQueryOptions(req.query));
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/transfers/:address/from
 * Transfers sent from an address
 */
router.get('/transfers/:address/from', async (req: Request, res: Response) => {
  const { address } = req.params;
  if (!requireValidAddress(address, res)) return;
  try {
    const transfers = await TransferQueryService.getTransfersFrom(address, parseQueryOptions(req.query));
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/transfers/:address/to
 * Transfers received by an address
 */
router.get('/transfers/:address/to', async (req: Request, res: Response) => {
  const { address } = req.params;
  if (!requireValidAddress(address, res)) return;
  try {
    const transfers = await TransferQueryService.getTransfersTo(address, parseQueryOptions(req.query));
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/baseindex/:address
 * Transfers for a specific token contract address
 */
router.get('/baseindex/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  if (!requireValidAddress(address, res)) return;
  try {
    const transfers = await TransferQueryService.getTransfersByToken(address, parseQueryOptions(req.query));
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/addresses/:address/tokens/:tokenAddress/transfers
 * Transfers for a specific address filtered by token
 */
router.get('/addresses/:address/tokens/:tokenAddress/transfers', async (req: Request, res: Response) => {
  const { address, tokenAddress } = req.params;
  if (!requireValidAddress(address, res)) return;
  if (!requireValidAddress(tokenAddress, res)) return;
  try {
    const transfers = await TransferQueryService.getTransfersByAddressAndToken(
      address,
      tokenAddress,
      parseQueryOptions(req.query)
    );
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/transfers/recent
 * Most recent transfers regardless of address
 */
router.get('/transfers/recent', async (req: Request, res: Response) => {
  try {
    const transfers = await TransferQueryService.getRecentTransfers(parseQueryOptions(req.query));
    res.json({ success: true, data: transfers, count: transfers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/stats
 * Real aggregate stats from the database
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const total = await TransferQueryService.getTotalCount();
    res.json({ success: true, data: { totalTransfers: total } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
