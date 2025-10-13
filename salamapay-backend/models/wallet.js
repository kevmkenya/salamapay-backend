const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WalletSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Wallet', WalletSchema);
