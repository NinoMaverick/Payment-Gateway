Payment Gateway API

## Overview
A modular backend API that supports Paystack and Flutterwave payments.

## Features
- Provider switching (Paystack, Flutterwave)
- Secure API key management
- Centralized error handling
- Deployed on Railway

## Tech Stack
- Node.js,
- Express,
- MongoDB

## Routes
- `POST /api/payment` — Initiate a payment
- `GET /api/payment/:id` — Get payment status

## Setup
1. Clone repo
2. Add `.env` with keys:
   - `FLW_SECRET_KEY`
   - `PAYSTACK_SECRET_KEY`
3. Run: `npm install && npm start`

## Live API

You can test the live API here:

🔗 https://payment-gateway-production-117c.up.railway.app

Example endpoints:
- `POST /api/payment`
- `GET /api/payment/:id`

## Postman Docs
https://documenter.getpostman.com/view/41080497/2sB34eJ2Cw 
