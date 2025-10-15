const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');

// create wallet
router.post('/deposit', async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ error: 'phone and amount required' });
  }
  // ... proceed to create/update wallet
});

// get wallet
router.get('/:phone', async (req, res) => {
  const phone = req.params.phone;
  const w = await Wallet.findOne({ phone });
  if (!w) return res.status(404).json({error:'not found'});
  res.json(w);
});

module.exports = router;
