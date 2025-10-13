const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

// Jenga webhook simulation: credits wallet when deposit arrives
router.post('/jenga', async (req, res) => {
  const { transactionId, amount, status, reference, msisdn } = req.body;
  // Normally verify signature here
  if (status === 'SUCCESS') {
    const phone = msisdn; // expecting 2547.... format
    let w = await Wallet.findOne({ phone });
    if (!w) {
      w = new Wallet({ phone, balance: amount });
    } else {
      w.balance += Number(amount);
    }
    await w.save();
    console.log(`Credited ${amount} to ${phone} for ref ${reference}`);
  }
  res.status(200).send('ACK');
});

module.exports = router;
