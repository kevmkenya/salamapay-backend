const express = require('express');
const Transaction = require('../models/transaction');

const router = express.Router();

router.get('/:phone', async (req, res) => {
  try {
    const transactions = await Transaction.find({ phone: req.params.phone }).sort({ createdAt: -1 });
    return res.json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

module.exports = router;
