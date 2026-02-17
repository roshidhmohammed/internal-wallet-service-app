import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';


dotenv.config({ path: envFile });


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding started.");

  await prisma.$transaction(
    async (tx) => {
      // Asset Types (Idempotent via upsert)
      const gold = await tx.assetType.upsert({
        where: { code: "GOLD" },
        update: {},
        create: {
          name: "Gold Coins",
          code: "GOLD",
        },
      });

      const diamonds = await tx.assetType.upsert({
        where: { code: "DIAMOND" },
        update: {},
        create: {
          name: "Diamonds",
          code: "DIAMOND",
        },
      });

      const loyalty = await tx.assetType.upsert({
        where: { code: "LOYALTY" },
        update: {},
        create: {
          name: "Loyalty Points",
          code: "LOYALTY",
        },
      });

      // System Treasury Wallet
      const treasury = await tx.wallet.create({
        data: {
          ownerType: "SYSTEM",
        },
      });

      // Treasury initial supply
      const treasuryBalance = await tx.walletBalance.create({
        data: {
          walletId: treasury.id,
          assetTypeId: gold.id,
          balance: BigInt(1000000000), // 1 Billion initial supply
        },
      });

      // Create Users
      const user1 = await tx.user.create({
        data: {
          email: "user1@example.com",
          name: "user1",
        },
      });

      const user2 = await tx.user.create({
        data: {
          email: "user2@example.com",
          name: "user2",
        },
      });

      //  Create Wallets for Users
      const wallet1 = await tx.wallet.create({
        data: {
          ownerId: user1.id,
          ownerType: "USER",
        },
      });

      const wallet2 = await tx.wallet.create({
        data: {
          ownerId: user2.id,
          ownerType: "USER",
        },
      });

      //  Initial Balances via Ledger (Double Entry)
      const initialAmountUser1 = BigInt(2000);
      const initialAmountUser2 = BigInt(9000);

      // ---- User 1 Initial Funding ----
      const tx1 = await tx.walletTransaction.create({
        data: {
          referenceId: "seed_init_user1",
          type: "BONUS",
        },
      });

      await tx.walletEntry.createMany({
        data: [
          {
            transactionId: tx1.id,
            walletId: treasury.id,
            assetTypeId: gold.id,
            amount: -initialAmountUser1,
          },
          {
            transactionId: tx1.id,
            walletId: wallet1.id,
            assetTypeId: gold.id,
            amount: initialAmountUser1,
          },
        ],
      });

      await tx.walletBalance.create({
        data: {
          walletId: wallet1.id,
          assetTypeId: gold.id,
          balance: initialAmountUser1,
        },
      });

      // -- User 2 Initial Funding --
      const tx2 = await tx.walletTransaction.create({
        data: {
          referenceId: "seed_init_user2",
          type: "BONUS",
        },
      });

      await tx.walletEntry.createMany({
        data: [
          {
            transactionId: tx2.id,
            walletId: treasury.id,
            assetTypeId: gold.id,
            amount: -initialAmountUser2,
          },
          {
            transactionId: tx2.id,
            walletId: wallet2.id,
            assetTypeId: gold.id,
            amount: initialAmountUser2,
          },
        ],
      });

      await tx.walletBalance.create({
        data: {
          walletId: wallet2.id,
          assetTypeId: gold.id,
          balance: initialAmountUser2,
        },
      });
    },
    {
      isolationLevel: "Serializable",
    },
  );

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
