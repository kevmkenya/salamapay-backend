const express = require('express');
const Escrow = require('../models/escrow');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { buyerPhone, sellerPhone, amount } = req.body;
    const numericAmount = Number(amount);

    if (!buyerPhone || !sellerPhone || !numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: 'buyerPhone, sellerPhone, and positive amount are required' });
    }

    const buyerWallet = await Wallet.findOne({ phone: buyerPhone });
    if (!buyerWallet) {
      return res.status(404).json({ error: 'buyer wallet not found' });
    }

    if (buyerWallet.balance < numericAmount) {
      return res.status(400).json({ error: 'insufficient buyer funds' });
    }

    buyerWallet.balance -= numericAmount;
    buyerWallet.escrowBalance += numericAmount;
    await buyerWallet.save();

    const escrow = await Escrow.create({
      buyerPhone,
      sellerPhone,
      amount: numericAmount,
      status: 'funded'
    });

    await Transaction.create({
      phone: buyerPhone,
      type: 'escrow_create',
      amount: numericAmount,
      metadata: { escrowId: escrow._id.toString(), sellerPhone }
    });

    return res.json({ success: true, escrow });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/release', async (req, res) => {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findById(escrowId);

    if (!escrow) {
      return res.status(404).json({ error: 'escrow not found' });
    }

    if (escrow.status !== 'funded') {
      return res.status(400).json({ error: `escrow cannot be released from status ${escrow.status}` });
    }

    const buyerWallet = await Wallet.findOne({ phone: escrow.buyerPhone });
    let sellerWallet = await Wallet.findOne({ phone: escrow.sellerPhone });
    if (!sellerWallet) {
      sellerWallet = await Wallet.create({ phone: escrow.sellerPhone });
    }

    buyerWallet.escrowBalance = Math.max(0, buyerWallet.escrowBalance - escrow.amount);
    sellerWallet.balance += escrow.amount;

    escrow.status = 'released';

    await Promise.all([buyerWallet.save(), sellerWallet.save(), escrow.save()]);

    await Transaction.create({
      phone: escrow.sellerPhone,
      type: 'escrow_release',
      amount: escrow.amount,
      metadata: { escrowId: escrow._id.toString(), buyerPhone: escrow.buyerPhone }
    });

    return res.json({ success: true, escrow });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/cancel', async (req, res) => {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findById(escrowId);

    if (!escrow) {
      return res.status(404).json({ error: 'escrow not found' });
    }

    if (escrow.status !== 'funded') {
      return res.status(400).json({ error: `escrow cannot be cancelled from status ${escrow.status}` });
    }

    const buyerWallet = await Wallet.findOne({ phone: escrow.buyerPhone });
    if (!buyerWallet) {
      return res.status(404).json({ error: 'buyer wallet not found' });
    }

    buyerWallet.balance += escrow.amount;
    buyerWallet.escrowBalance = Math.max(0, buyerWallet.escrowBalance - escrow.amount);
    escrow.status = 'cancelled';

    await Promise.all([buyerWallet.save(), escrow.save()]);

    await Transaction.create({
      phone: escrow.buyerPhone,
      type: 'escrow_cancel',
      amount: escrow.amount,
      metadata: { escrowId: escrow._id.toString() }
    });

    return res.json({ success: true, escrow });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:phone', async (req, res) => {
  try {
    const escrows = await Escrow.find({
      $or: [{ buyerPhone: req.params.phone }, { sellerPhone: req.params.phone }]
    }).sort({ createdAt: -1 });

    return res.json({ success: true, escrows });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
