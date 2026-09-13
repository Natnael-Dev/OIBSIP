# Crust & Craft — Production-Grade Pizza Delivery & Inventory Automation

> **Level 3 · Task 1:** Pizza Delivery Full-Stack Application  
> **Track:** Web Development & Designing — Oasis Infobyte (SIP)  
> **Intern:** Natnael Tezazu  

---

## 🍕 Project Overview

**Crust & Craft** is a production-grade full-stack MERN platform built to satisfy every single requirement of the **Oasis Infobyte Level 3 Internship Mandate**. 

It features:
1. **Interactive Custom Pizza Builder:** A 4-step progressive customization flow with 5 bases, 5 sauces, artisanal cheeses, and multi-select vegetables with real-time price calculation.
2. **Transaction Security:** Official Razorpay test mode integration with cryptographic HMAC-SHA256 signature verification.
3. **Atomic Stock Decrement:** Concurrency-safe MongoDB `$inc` updates that immediately deduct used ingredients upon order placement.
4. **Automated Low-Stock Monitor (`node-cron`):** A background worker checking stock thresholds (<= 20 units) and dispatching emergency HTML alerts via Nodemailer.
5. **Real-Time Kitchen Dispatcher (`Socket.io`):** A live tracking system advancing orders from *Received* ➔ *In Kitchen* ➔ *Sent to Delivery* ➔ *Delivered* with zero-latency synchronization.
6. **Isolated Admin Operations Cockpit:** Secure management console with one-click restock controls (`+20`, `+50`) and threshold customization.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd WebDev-L3-PizzaDelivery/server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Seed initial 5 bases, 5 sauces, cheeses, veggies & admin account
npm run seed

# Launch server with hot reloading
npm run dev
```

The API will be live at `http://localhost:5000/api` with WebSocket gateway ready.

---

## 🔑 Default Test Credentials

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@crustcraft.com` | `AdminSecret2026!` | `/admin/login` |
| **Customer** | `natnael@crustcraft.com` | `CustomerPass2026!` | `/login` |

---

## 📋 Feature Verification Checklist

- [x] **User Registration & Email Verification:** Tokenized activation links via Nodemailer.
- [x] **JWT Authorization:** Salted bcrypt hashing and Bearer JWT route protection.
- [x] **Password Recovery Flow:** 15-minute expiring cryptographic reset tokens.
- [x] **Pizza Catalog:** Curated signature pizzas with imagery, ingredients, and tags.
- [x] **4-Step Custom Pizza Builder:**
  - [x] 5 Pizza Bases (*Hand-Tossed, Thin Crust, Sourdough, Gluten-Free, Stuffed Crust*)
  - [x] 5 Sauces (*Marinara, Arrabiata, Garlic Alfredo, Smoky BBQ, Basil Pesto*)
  - [x] Cheese selection (*Mozzarella, Aged Cheddar, Smoked Gouda, Ricotta, Vegan Cashew*)
  - [x] Multi-select vegetables (*Peppers, Onions, Olives, Jalapeños, Mushrooms, Tomatoes*)
- [x] **Order Summary & Live Pricing:** Subtotal, 8% tax, and delivery fee calculations.
- [x] **Razorpay Test Integration:** Orders API integration + HMAC SHA-256 verification.
- [x] **Real-Time Order Status Tracker:** WebSocket-driven live timeline stepper.
- [x] **Isolated Admin Login:** Strictly gated route for administrative credentials.
- [x] **Live Inventory Dashboard:** Color-coded stock meters across all 4 categories.
- [x] **Atomic Stock Decrement:** Concurrency-safe decrement upon payment capture.
- [x] **Manual Stock Replenishment:** Dynamic `+20` / `+50` quick restock actions.
- [x] **Automated Low-Stock Email Alerts:** `node-cron` daemon auditing stock `<= 20 units`.
