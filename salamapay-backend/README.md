# SalamaPay Backend (MVP)

Node.js + Express + MongoDB backend for the SalamaPay wallet and escrow MVP.

## Features
- Firebase-auth verification endpoint with backend JWT issuance.
- Wallet APIs: deposit, withdraw, fetch wallet.
- Escrow APIs: create (fund), release, cancel, list.
- M-Pesa STK trigger endpoint (simulation stub for integration).
- Webhook handlers for M-Pesa/Jenga deposit callbacks.
- Transaction history endpoint.

## Quick start
1. Copy environment template:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Start the backend:
   - `npm start`
4. Health check:
   - `GET http://localhost:10000/api/health`

## API routes
- `POST /api/auth/verify`
- `POST /api/wallet/deposit`
- `POST /api/wallet/withdraw`
- `GET /api/wallet/:phone`
- `POST /api/escrow`
- `POST /api/escrow/release`
- `POST /api/escrow/cancel`
- `GET /api/escrow/:phone`
- `GET /api/history/:phone`
- `POST /api/mpesa/stk`
- `POST /api/webhook/mpesa`
- `POST /api/webhook/jenga`

## Notes
- The M-Pesa STK endpoint is a simulation stub for MVP scaffolding.
- Replace `JWT_SECRET` and wire in real Firebase token verification before production.
