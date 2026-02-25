const express = require('express');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const { withdrawalFee } = require('../utils/fees');

const router = express.Router();

async function getOrCreateWallet(phone) {
  let wallet = await Wallet.findOne({ phone });
  if (!wallet) {
    wallet = await Wallet.create({ phone });
  }
  return wallet;
}

router.post('/deposit', async (req, res) => {
  try {
    const { phone, amount, reference } = req.body;
    const numericAmount = Number(amount);

    if (!phone || !numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: 'phone and positive amount are required' });
    }

    const wallet = await getOrCreateWallet(phone);
    wallet.balance += numericAmount;
    await wallet.save();

    await Transaction.create({
      phone,
      type: 'deposit',
      amount: numericAmount,
      reference,
      metadata: { source: 'manual_or_webhook' }
    });

    return res.json({
      success: true,
      message: `Deposited KES ${numericAmount} successfully.`,
      wallet
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/withdraw', async (req, res) => {
  try {
    const { phone, amount, reference } = req.body;
    const numericAmount = Number(amount);

    if (!phone || !numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: 'phone and positive amount are required' });
    }

    const wallet = await Wallet.findOne({ phone });
    if (!wallet) {
      return res.status(404).json({ error: 'wallet not found' });
    }

    const fee = withdrawalFee(numericAmount);
    const totalDebit = numericAmount + fee;

    if (wallet.balance < totalDebit) {
      return res.status(400).json({
        error: 'insufficient funds',
        required: totalDebit,
        available: wallet.balance
      });
    }

    wallet.balance -= totalDebit;
    await wallet.save();

    await Transaction.create({
      phone,
      type: 'withdrawal',
      amount: numericAmount,
      reference,
      metadata: { fee, totalDebit }
    });

    return res.json({
      success: true,
      message: `Withdrew KES ${numericAmount} (fee KES ${fee}).`,
      fee,
      wallet
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:phone', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ phone: req.params.phone });
    if (!wallet) {
      return res.status(404).json({ error: 'wallet not found' });
    }

    return res.json(wallet);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
