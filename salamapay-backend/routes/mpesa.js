const express = require('express');

const router = express.Router();

router.post('/stk', async (req, res) => {
  const { phone, amount } = req.body;
  const numericAmount = Number(amount);

  if (!phone || !numericAmount || numericAmount <= 0) {
    return res.status(400).json({ error: 'phone and positive amount are required' });
  }

  return res.json({
    success: true,
    message: 'STK push initiated (simulation).',
    paybill: process.env.MPESA_PAYBILL || '3464442',
    request: {
      phone,
      amount: numericAmount
    }
  });
});

module.exports = router;
