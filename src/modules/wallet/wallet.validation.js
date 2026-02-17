import { z } from 'zod';

export const transactionSchema = z.object({
  transactionID: z.string(),
  walletId: z.string().uuid(),
  assetTypeId: z.number(),
  amount: z.number().positive(),
});
