const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/verify', async (req, res) => {
  try {
    const { idToken, phone, uid } = req.body;

    if (!idToken && !uid) {
      return res.status(400).json({ error: 'idToken or uid is required' });
    }

    const resolvedUid = uid || 'firebase-user';
    const resolvedPhone = phone || '254700000000';

    const token = jwt.sign(
      { uid: resolvedUid, phone: resolvedPhone },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      user: { uid: resolvedUid, phone: resolvedPhone },
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Auth verification failed', details: err.message });
  }
});

module.exports = router;
