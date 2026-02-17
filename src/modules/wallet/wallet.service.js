import prisma from '../../config/prisma.js';
import AppError from '../../utils/AppError.js';
import * as repository from './wallet.repository.js';

export const processTransaction = async ({
  referenceId,
  walletId,
  assetTypeId,
  amount,
  type,
}) => {

  if (!referenceId) {
    throw new AppError("Reference ID required", 400);
  }

  if (Number(amount) <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  return prisma.$transaction(async (tx) => {

    // Idempotency

    const existing = await repository.findTransactionByReference(referenceId, tx);
    if (existing) return existing;

    // Get Treasury

    const treasury = await repository.findSystemWallet(tx);
    if (!treasury) {
      throw new AppError("Treasury wallet not found", 500);
    }

    // User Balance

    let userBalance = await repository.findWalletBalance(walletId, assetTypeId, tx);

    if (!userBalance) {
      userBalance = await repository.createWalletBalance({
        walletId,
        assetTypeId,
        balance: BigInt(0),
      }, tx);
    }

    // Treasury Balance

    let treasuryBalance = await repository.findWalletBalance(
      treasury.id,
      assetTypeId,
      tx
    );

    if (!treasuryBalance) {
      treasuryBalance = await repository.createWalletBalance({
        walletId: treasury.id,
        assetTypeId,
        balance: BigInt(0),
      }, tx);
    }

    const bigAmount = BigInt(amount);

    // Optional: Prevent treasury going negative (good safety)
    if (
      (type === "TOPUP" || type === "BONUS") &&
      treasuryBalance.balance < bigAmount
    ) {
      throw new AppError("Treasury insufficient balance", 500);
    }

    if (type === "SPEND" && userBalance.balance < bigAmount) {
      throw new AppError("Insufficient balance", 400);
    }

    // Create Transaction

    const transaction = await repository.createTransaction({
      referenceId,
      type,
    }, tx);

    // DOUBLE ENTRY

    if (type === "TOPUP" || type === "BONUS") {

      // Treasury -amount
      await repository.updateBalance(
        treasuryBalance.id,
        treasuryBalance.balance - bigAmount,
        tx
      );

      await repository.createLedgerEntry({
        transactionId: transaction.id,
        walletId: treasury.id,
        assetTypeId,
        amount: -bigAmount,
      }, tx);

      // User +amount
      await repository.updateBalance(
        userBalance.id,
        userBalance.balance + bigAmount,
        tx
      );

      await repository.createLedgerEntry({
        transactionId: transaction.id,
        walletId,
        assetTypeId,
        amount: bigAmount,
      }, tx);

    } else if (type === "SPEND") {

      // User -amount
      await repository.updateBalance(
        userBalance.id,
        userBalance.balance - bigAmount,
        tx
      );

      await repository.createLedgerEntry({
        transactionId: transaction.id,
        walletId,
        assetTypeId,
        amount: -bigAmount,
      }, tx);

      // Treasury +amount
      await repository.updateBalance(
        treasuryBalance.id,
        treasuryBalance.balance + bigAmount,
        tx
      );

      await repository.createLedgerEntry({
        transactionId: transaction.id,
        walletId: treasury.id,
        assetTypeId,
        amount: bigAmount,
      }, tx);
    }

    return transaction;

  }, {
    isolationLevel: 'Serializable',
  });
};



export const getBalance = async (walletId) => {
  const balances = await repository.getWalletBalances(walletId);

  return balances.map(b => ({
    ...b,
    balance: b.balance.toString()
  }));
};
