const express = require('express');
const router = express.Router();
// Firebase admin skeleton - initialize in a secure way in production
router.post('/verify', async (req, res) => {
  // client sends a Firebase ID token, backend verifies and returns user info
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error:'idToken required' });
  // In production verify with firebase-admin sdk
  // const decoded = await admin.auth().verifyIdToken(idToken);
  return res.json({ uid: 'test-user', phone: '254700000000' });
});

module.exports = router;
