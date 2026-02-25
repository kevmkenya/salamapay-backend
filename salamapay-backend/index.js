require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const walletRoutes = require('./routes/wallet');
const escrowRoutes = require('./routes/escrow');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const mpesaRoutes = require('./routes/mpesa');
const historyRoutes = require('./routes/history');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SalamaPay backend running' });
});

app.get('/api/status', (req, res) => {
  res.json({ success: true, message: '✅ SalamaPay backend is live and healthy!' });
});

app.use('/api/wallet', walletRoutes);
app.use('/api/wallets', walletRoutes); // backwards compatibility
app.use('/api/escrow', escrowRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);

const PORT = process.env.PORT || 10000;

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in .env');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log('SalamaPay backend listening on', PORT);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
