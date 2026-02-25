const express = require('express');
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

const router = express.Router();

async function handleCredit(msisdn, amount, reference, channel) {
  const numericAmount = Number(amount);
  if (!msisdn || !numericAmount || numericAmount <= 0) {
    return;
  }

  let wallet = await Wallet.findOne({ phone: msisdn });
  if (!wallet) {
    wallet = await Wallet.create({ phone: msisdn, balance: numericAmount });
  } else {
    wallet.balance += numericAmount;
    await wallet.save();
  }

  await Transaction.create({
    phone: msisdn,
    type: 'deposit',
    amount: numericAmount,
    status: 'success',
    reference,
    metadata: { source: channel }
  });
}

router.post('/mpesa', async (req, res) => {
  try {
    const { amount, status, reference, msisdn } = req.body;

    if (status === 'SUCCESS') {
      await handleCredit(msisdn, amount, reference, 'mpesa');
    }

    return res.status(200).json({ ack: true });
  } catch (err) {
    return res.status(500).json({ error: 'Webhook processing failed', details: err.message });
  }
});

router.post('/jenga', async (req, res) => {
  try {
    const { amount, status, reference, msisdn } = req.body;

    if (status === 'SUCCESS') {
      await handleCredit(msisdn, amount, reference, 'jenga');
    }

    return res.status(200).json({ ack: true });
  } catch (err) {
    return res.status(500).json({ error: 'Webhook processing failed', details: err.message });
  }
});

module.exports = router;
