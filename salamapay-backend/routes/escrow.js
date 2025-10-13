const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const fees = require('../utils/fees');

// create escrow (buyer pays into escrow)
router.post('/', async (req, res) => {
  const { buyer, seller, amount } = req.body;
  if (!buyer || !seller || !amount) return res.status(400).json({ error:'missing fields' });
  const txn = new Transaction({ buyer, seller, amount, status:'PENDING' });
  await txn.save();
  res.json(txn);
});

// confirm delivery (buyer confirms => release funds to seller wallet)
router.post('/confirm', async (req, res) => {
  const { transactionId } = req.body;
  const txn = await Transaction.findById(transactionId);
  if (!txn) return res.status(404).json({error:'txn not found'});
  if (txn.status !== 'PENDING') return res.status(400).json({error:'invalid status'});
  // debit buyer, credit seller (simplified - assumes balances already available)
  const buyerW = await Wallet.findOne({ phone: txn.buyer });
  const sellerW = await Wallet.findOne({ phone: txn.seller }) || new Wallet({ phone: txn.seller });
  const total = txn.amount + fees.escrowFee(txn.amount);
  if (!buyerW || buyerW.balance < total) return res.status(400).json({error:'insufficient funds'});
  buyerW.balance -= total;
  sellerW.balance += txn.amount;
  await buyerW.save();
  await sellerW.save();
  txn.status = 'RELEASED';
  await txn.save();
  res.json({ success:true, txn });
});

module.exports = router;
