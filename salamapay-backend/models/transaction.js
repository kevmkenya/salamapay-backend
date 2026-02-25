const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    phone: { type: String, index: true },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'escrow_create', 'escrow_release', 'escrow_cancel'],
      required: true
    },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'success' },
    reference: { type: String },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
