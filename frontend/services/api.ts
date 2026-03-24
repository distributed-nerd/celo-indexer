// frontend/services/api.ts
// Re-exports from the unified lib/api.ts so existing imports keep working.
export {
  getRecentTransfers,
  getTransfersByAddress,
  getTransfersFrom,
  getTransfersTo,
  getTransfersByToken,
  getTransfersByAddressAndToken,
  getStats,
  runAIQuery,
} from '../lib/api';
