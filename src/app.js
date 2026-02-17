import express from 'express';
import walletRoutes from './modules/wallet/wallet.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Internal Wallet Service',
  });
});

app.use('/api/wallet', walletRoutes)

app.use(errorMiddleware);

export default app;
