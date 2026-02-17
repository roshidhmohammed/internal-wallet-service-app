import AppError from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as walletService from "./wallet.service.js";

export const topUp = asyncHandler(async (req, res, next) => {
  try {
    const {  walletId, assetTypeId, amount, transactionID } = req.body;
    const referenceId = `topup_${walletId}_${transactionID}`;

    //       if (!paymentId) {
    //   throw new AppError("Payment ID is required", 400);
    // }

    // // Verify Payment (Simulated)
    //   const payment = await paymentService.verifyPayment(paymentId);

    //     if (!payment || payment.status !== "SUCCESS") {
    //   throw new AppError("Payment not verified", 400);
    // }
    // Optional: validate amount matches payment
    //   if (Number(payment.amount) !== Number(amount)) {
    //   throw new AppError("Payment amount mismatch", 400);
    // }

    // Process Wallet Credit
    const result = await walletService.processTransaction({
      referenceId,
      walletId,
      assetTypeId,
      amount,
      type: "TOPUP",
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export const bonus = asyncHandler(async (req, res, next) => {
  try {
    const { walletId, assetTypeId, amount, transactionID } = req.body
    if (!walletId) {
      throw new AppError("walletId is required", 400);
    }

    if (!assetTypeId) {
      throw new AppError("assetTypeId is required", 400);
    }

    if (!amount || Number(amount) <= 0) {
      throw new AppError("Amount must be greater than 0", 400);
    }

    const referenceId = `bonus_${transactionID}_${walletId}`;
    const result = await walletService.processTransaction({
      referenceId,
      walletId,
      assetTypeId,
      amount,
      type: "BONUS",
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export const spend = asyncHandler(async (req, res, next) => {
  try {

     const { walletId, assetTypeId, amount, transactionID } = req.body;

     if(!transactionID){
      throw new AppError("transactionID is required", 400);
     }
    if (!walletId) {
      throw new AppError("walletId is required", 400);
    }

    if (!assetTypeId) {
      throw new AppError("assetTypeId is required", 400);
    }

    if (!amount || Number(amount) <= 0) {
      throw new AppError("Amount must be greater than 0", 400);
    }

    const referenceId = `spend_${transactionID}_${walletId}`;

    const result = await walletService.processTransaction({
     referenceId,
      walletId,
      assetTypeId,
      amount,
      type: "SPEND",
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export const getBalance = asyncHandler(async (req, res, next) => {
  try {
    const balance = await walletService.getBalance(req.params.walletId);
    res.json({ success: true, data: balance[0] });
  } catch (error) {
    next(error);
  }
});
