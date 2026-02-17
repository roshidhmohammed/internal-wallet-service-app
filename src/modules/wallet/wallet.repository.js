import prisma from "../../config/prisma.js";

// Transaction Queries
export const findTransactionByReference = (referenceId, tx) => {
  return tx.walletTransaction.findUnique({
    where: { referenceId },
  });
};

export const createTransaction = (data, tx) => {
  return tx.walletTransaction.create({
    data,
  });
};

// Wallet Queries
export const findWalletById = (walletId, tx) => {
  return tx.wallet.findUnique({
    where: { id: walletId },
  });
};

// Balance Queries
export const findWalletBalance = (walletId, assetTypeId, tx) => {
  return tx.walletBalance.findUnique({
    where: {
      walletId_assetTypeId: {
        walletId,
        assetTypeId,
      },
    },
  });
};

export const findSystemWallet = (tx) => {
  return tx.wallet.findFirst({
    where: { ownerType: "SYSTEM" },
  });
};


export const createWalletBalance = (data, tx) => {
  return tx.walletBalance.create({
    data,
  });
};

export const updateBalance = (balanceId, newBalance, tx) => {
  return tx.walletBalance.update({
    where: { id: balanceId },
    data: { balance: newBalance },
  });
};

// Ledger Queries
export const createLedgerEntry = (data, tx) => {
  return tx.walletEntry.create({
    data,
  });
};

// Read Queries
export const getWalletBalances = (walletId) => {
  return prisma.walletBalance.findMany({
    where: { walletId },
  });
};
