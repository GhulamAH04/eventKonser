// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.routes'; 
import transactionRoutes from './routes/transaction.routes';
import { startTransactionExpireJob } from './jobs/transactionExpire.job';
import authRoutes from './routes/auth.routes';
import { autoCancelTransactions } from './jobs/autoCancelTransaction';
import organizerRoutes from './routes/organizer.routes';
import reviewRoutes from './routes/reviews.routes';
import voucherRoutes from './routes/voucher.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ PASANG CORS DI SINI (sebelum routes)
app.use(cors({
  origin: 'http://localhost:3000', // frontend kamu
  credentials: true,
}));

app.use(express.json());

// ✅ Semua route
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  autoCancelTransactions();
  startTransactionExpireJob();
});
