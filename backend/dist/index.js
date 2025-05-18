"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const transactionExpire_job_1 = require("./jobs/transactionExpire.job");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const autoCancelTransaction_1 = require("./jobs/autoCancelTransaction");
const organizer_routes_1 = __importDefault(require("./routes/organizer.routes"));
const reviews_routes_1 = __importDefault(require("./routes/reviews.routes"));
const voucher_routes_1 = __importDefault(require("./routes/voucher.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/events', event_routes_1.default);
app.use('/api/organizers', organizer_routes_1.default);
app.use('/api/reviews', reviews_routes_1.default);
app.use("/api/vouchers", voucher_routes_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send('API is running');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    (0, autoCancelTransaction_1.autoCancelTransactions)(); //  Cron 3 hari auto cancel aktif
    (0, transactionExpire_job_1.startTransactionExpireJob)(); //  Timer expire 2 jam jalan
});
