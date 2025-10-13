# SalamaPay Backend Starter (Sandbox-ready)

## Overview
Minimal Node.js/Express starter backend for SalamaPay.
Includes:
- Wallet and escrow routes (skeleton)
- Jenga (Equity) sandbox helpers (placeholder)
- Webhook endpoint for Jenga callbacks
- Firebase Admin skeleton for OTP/auth (optional)

## Quick start (local)
1. Copy `.env.example` to `.env` and fill in values (MONGO_URI, Jenga keys, Firebase keys if used).
2. `npm install`
3. `node index.js`
4. Visit `http://localhost:10000/api/health` to confirm.

## Deploy to Render
- Push this repo to GitHub.
- Create a new Web Service on Render, connect the repo, set environment variables in Render dashboard, and deploy.
- Configure Jenga webhook to point to `https://<render-url>/api/webhook/jenga` for deposit notifications.

## Notes
This is a starter template meant for sandbox/testing. Secure secrets and add production-grade security before going live.
