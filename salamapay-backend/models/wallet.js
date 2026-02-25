const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    escrowBalance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'KES' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);
