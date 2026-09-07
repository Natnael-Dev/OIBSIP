# Oasis Infobyte Student Internship Program (OIB-SIP)
> **Domain:** Web Development & Designing  
> **Intern:** Natnael Tezazu  
> **Batch:** August – September 2026  
> **Repository Name:** `OIBSIP`  

---

## 📌 Executive Overview

This repository contains the complete internship submission for the **Oasis Infobyte Student Internship Program (SIP)**. 

Per the official syllabus guidelines (*Section 2 — Domain Track Matrix*), interns are instructed to complete any **one complete level** (Level 1, Level 2, or Level 3). 

We selected **Level 3 (Advanced Full-Stack)** — the most demanding, production-grade tier in the curriculum — implementing:
👉 **`WebDev-L3-PizzaDelivery`**: **Crust & Craft — Full-Stack Pizza Delivery & Inventory Automation Platform**

---

## 📂 Repository Directory Hierarchy

Strictly complying with Section 1.3 of the Oasis Infobyte guidelines:

```
OIBSIP/
├── WebDev-L3-PizzaDelivery/          <-- Level 3 Production Full-Stack Application
│   ├── server/                       <-- Express, MongoDB, Socket.io, Cron & Razorpay API
│   ├── client/                       <-- React, Tailwind CSS, Lucide, Real-Time Tracker UI
│   ├── package.json
│   ├── .env.example
│   └── README.md                     <-- Detailed application documentation & feature guide
│
├── architecture.md                   <-- System architecture & Mermaid dataflow diagrams
├── PRD.md                            <-- Complete Product Requirements Document
├── API_SPECIFICATION.md              <-- REST & WebSocket API contracts
├── DATA_DICTIONARY.md                <-- MongoDB schemas, fields, indices, and constraints
├── INVENTORY_AUTOMATION_SPEC.md      <-- node-cron worker & atomic decrement specifications
├── PAYMENT_GATEWAY_INTEGRATION.md     <-- Razorpay test mode & HMAC signature verification
├── ANTI_SLOP_AND_DESIGN_MANIFESTO.md <-- Production standards, zero AI slop, WCAG AA compliance
├── GIT_COMMIT_TIMELINE.md            <-- Conventional Commits timeline & commit ledger
└── everything-you-want-to-rule.md    <-- Submission protocol, video title card rules, & rubric
```

---

## 🛠️ Level 3 Project Feature Matrix

| Oasis Infobyte Requirement | Implementation Status | Tech Stack / Architecture |
| :--- | :---: | :--- |
| **Email Verification & JWT Auth** | ✅ Complete | Node.js, `bcryptjs`, `jsonwebtoken`, Nodemailer |
| **Password Recovery Flow** | ✅ Complete | Crypto-tokenized reset link (15-min TTL) |
| **Curated Pizza Varieties Menu** | ✅ Complete | Dynamic catalog with dietary filters & high-res visuals |
| **4-Step Custom Pizza Builder** | ✅ Complete | **5 Bases**, **5 Sauces**, Cheeses, Multi-Veggie Selection |
| **Live Price Calculator** | ✅ Complete | Real-time dynamic sum engine |
| **Razorpay Payment Gateway** | ✅ Complete | Razorpay Orders API + HMAC SHA-256 Signature Verification |
| **Real-Time Order Tracking** | ✅ Complete | WebSocket (`Socket.io`) stepper (Received ➔ Kitchen ➔ Delivery) |
| **Isolated Admin Cockpit** | ✅ Complete | Separate `/admin/login` route with RBAC role guard |
| **Live Inventory Dashboard** | ✅ Complete | Visual stock meters across Bases, Sauces, Cheeses, Veggies |
| **Atomic Stock Decrement** | ✅ Complete | Atomic MongoDB `$inc` updates on confirmed payment |
| **Manual Stock Adjustments** | ✅ Complete | Quick restock (+20 / +50) controls with instant DB sync |
| **Automated Low-Stock Email Alerts**| ✅ Complete | `node-cron` daemon auditing stock <= 20 units via Nodemailer |

---

## 🎥 Demonstration Video & Verification

* **Video Intro:** First 2 seconds feature the mandatory static title card displaying:
  1. **Full Name:** Natnael Tezazu
  2. **Assigned Track:** Web Development & Designing
  3. **Task Title:** Level 3 - Task 1: Pizza Delivery Full-Stack Application
* **Walkthrough:** Shows end-to-end customer order builder, Razorpay checkout, live WebSocket status progression, admin inventory decrement, and automated low-stock email trigger.

---

## 👨‍💻 Intern Details & Verification

* **Intern:** Natnael Tezazu
* **Domain:** Web Development and Designing
* **Organization:** [Oasis Infobyte](https://oasisinfobyte.com/)
* **GitHub:** [@Natnael-Dev](https://github.com/Natnael-Dev)
* **LinkedIn:** [Natnael Tezazu](https://linkedin.com)
