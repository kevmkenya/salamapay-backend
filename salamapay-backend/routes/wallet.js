const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');

// 💰 Deposit to Wallet (Create if not exists)
router.post('/deposit', async (req, res) => {
  try {
    const { phone, amount } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ error: 'phone and amount required' });
    }

    // check if wallet exists
    let wallet = await Wallet.findOne({ phone });
    if (!wallet) {
      wallet = new Wallet({ phone, balance: 0 });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    res.json({
      success: true,
      message: `Deposited KES ${amount} successfully.`,
      balance: wallet.balance
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// 📲 Get wallet by phone
router.get('/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const wallet = await Wallet.findOne({ phone });
    if (!wallet) {
      return res.status(404).json({ error: 'wallet not found' });
    }
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
