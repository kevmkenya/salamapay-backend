const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  buyer: String,
  seller: String,
  amount: Number,
  status: String,
  reference: String
}, { timestamps: true });
module.exports = mongoose.model('Transaction', TransactionSchema);
