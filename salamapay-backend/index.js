require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const walletRoutes = require('./routes/wallet');
const escrowRoutes = require('./routes/escrow');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth'); // firebase auth skeleton

const app = express();
app.use(bodyParser.json());

app.get('/api/health', (req, res) => res.json({status:'ok', message: 'SalamaPay backend running'}));

app.use('/api/wallets', walletRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 10000;

// Health check route
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: '✅ SalamaPay backend is live and healthy!'
  });
});

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in .env');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('SalamaPay backend listening on', PORT));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
