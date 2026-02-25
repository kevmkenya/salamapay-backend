const mongoose = require('mongoose');

const EscrowSchema = new mongoose.Schema(
  {
    buyerPhone: { type: String, required: true, index: true },
    sellerPhone: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'funded', 'released', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Escrow', EscrowSchema);
