import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.routes'; 
import transactionRoutes from './routes/transaction.routes';
import { startTransactionExpireJob } from './jobs/transaction-expire.job';
import authRoutes from './routes/auth.routes';
import { autoCancelTransactions } from './jobs/autoCancelTransaction';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  autoCancelTransactions();      // 🔥 Cron 3 hari auto cancel aktif
  startTransactionExpireJob();   // 🔥 Timer expire 2 jam jalan
});
