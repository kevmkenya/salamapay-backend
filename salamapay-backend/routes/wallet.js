const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');

// create wallet
router.post('/', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({error:'phone required'});
  const w = new Wallet({ phone });
  await w.save();
  res.json(w);
});

// get wallet
router.get('/:phone', async (req, res) => {
  const phone = req.params.phone;
  const w = await Wallet.findOne({ phone });
  if (!w) return res.status(404).json({error:'not found'});
  res.json(w);
});

module.exports = router;
