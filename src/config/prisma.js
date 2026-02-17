import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config({ path: '.env.development' });
// Create pg pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client WITH adapter
const prisma = new PrismaClient({
  adapter,
});

export default prisma
