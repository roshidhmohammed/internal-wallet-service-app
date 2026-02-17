import express from 'express';
import * as controller from './wallet.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { transactionSchema } from './wallet.validation.js';

const router = express.Router();

router.post('/topup', validate(transactionSchema), controller.topUp);
router.post('/bonus',  controller.bonus);
router.post('/spend', controller.spend);

router.get('/:walletId/balance', controller.getBalance);

export default router;
