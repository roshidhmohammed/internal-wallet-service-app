import dotenv from 'dotenv';
import app from './app.js';
import prisma from './config/prisma.js';

const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

dotenv.config({ path: envFile });


  console.log(process.env.NODE_ENV)



const PORT = process.env.PORT;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
