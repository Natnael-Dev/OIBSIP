# Product Requirements Document (PRD)

## Project: Crust & Craft — Production-Grade Pizza Delivery & Inventory Automation
**Level:** Level 3 (Advanced Full-Stack)  
**Track:** Web Development & Designing — Oasis Infobyte (SIP)  
**Author:** Natnael Tezazu  
**Date:** September 2026  

---

## 1. Executive Summary

**Crust & Craft** is an enterprise-grade full-stack pizza ordering and automated inventory control platform. It solves two tightly coupled problems:
1. **Customer Delight:** A seamless, interactive customer experience featuring pre-configured artisanal pizza varieties, a custom 4-step modular pizza builder, frictionless test-mode payment gateway integration (Razorpay), and real-time live order status tracking.
2. **Operations & Stock Governance:** An isolated administrative management cockpit featuring live inventory tracking across base, sauce, cheese, and veggie ingredients, atomic inventory decrement upon order creation, manual stock replenishment, an automated low-stock background audit job (`node-cron`) that dispatches email alerts, and an order dispatch board that pushes real-time status transitions directly to active customers.

---

## 2. User Personas & Permissions

| Role | Access Boundary | Key Capabilities |
| :--- | :--- | :--- |
| **Customer (`User`)** | Public Web Portal & Customer Dashboard | - Register with email verification<br>- JWT login / logout<br>- Forgot/reset password via tokenized link<br>- Browse curated pizza menu<br>- Build custom pizza via 4-step builder<br>- Review order bill & pay via Razorpay test mode<br>- Live tracking: Received → In Kitchen → Out for Delivery |
| **Store Manager (`Admin`)** | Isolated Admin Portal (`/admin/login`) | - Dedicated admin credentials (no public self-registration)<br>- Monitor stock levels across all 4 ingredient categories<br>- Atomic inventory decrement validation<br>- Manual stock adjustments / restocking<br>- Configure low-stock alert thresholds (default: < 20 units)<br>- Transition order fulfillment states in real-time |

---

## 3. Detailed Feature Specifications

### 3.1 Authentication & User Lifecycle
* **Registration:**
  - Input: Name, Email, Password (min 8 chars, 1 number).
  - Generates a crypto-secure verification token.
  - Sends email with verification link (or instant one-click activation in demo mode).
* **Login & Session Authorization:**
  - Authenticates credentials using `bcrypt` (salted rounds >= 10).
  - Issues an HTTP-only or secure Bearer JWT token with expiry.
* **Password Recovery Flow:**
  - "Forgot Password" sends a one-time crypto reset token with a 15-minute TTL.
  - Reset form verifies token match and enforces strong password criteria.
* **Isolated Admin Authentication:**
  - `/admin/login` enforces `role === 'admin'`.
  - Customer accounts attempting to log into the admin dashboard receive a 403 Forbidden.

### 3.2 Customer Order & Custom Pizza Builder Experience
* **Curated Menu Catalog:**
  - Cards displaying signature pizzas (e.g., *Truffle Mushroom Deluxe*, *Spicy Diablo Pepperoni*, *Garden Verde Pesto*).
  - Displays description, allergens, ingredients, and dynamic price.
* **Modular 4-Step Custom Pizza Builder:**
  - **Step 1: Pizza Base Selection** (5 options)
    1. *Classic Hand-Tossed*
    2. *Thin Crust Crispy*
    3. *Rustic Sourdough*
    4. *Gluten-Free Cauliflower Crust*
    5. *Cheesy Garlic Stuffed Crust*
  - **Step 2: Sauce Selection** (5 options)
    1. *Classic San Marzano Marinara*
    2. *Fiery Arrabiata*
    3. *Creamy Roasted Garlic Alfredo*
    4. *Smoky Hickory BBQ*
    5. *Ligurian Basil Pesto*
  - **Step 3: Cheese Selection** (Single select)
    1. *Fior di Latte Mozzarella*
    2. *Sharp Aged Cheddar*
    3. *Smoked Gouda*
    4. *Fresh Ricotta Dollops*
    5. *Artisanal Vegan Cashew Cheese*
  - **Step 4: Vegetable Selection** (Multi-select)
    1. *Sweet Bell Peppers*
    2. *Slow-Caramelized Onions*
    3. *Kalamata Black Olives*
    4. *Pickled Jalapeños*
    5. *Button Mushrooms*
    6. *Sun-Dried Tomatoes*
  - **Real-Time Dynamic Pricing Engine:**
    - Live bill calculator updates as ingredients are toggled.
    - Displays inventory availability (greys out or blocks options if stock == 0).
* **Order Summary & Checkout:**
  - Itemized breakdown of crust, sauce, cheese, veggies, taxes, and total.
  - Delivery address & contact phone inputs.
* **Razorpay Test Payment Gateway:**
  - Integration with Razorpay Orders API (`POST /api/orders/razorpay-initiate`).
  - Opens standard Razorpay test modal with key id.
  - Test payment simulation: clicking "Success" generates payment signature.
  - Backend verifies HMAC SHA256 signature before transitioning order status to `PAID`.
* **Real-Time Live Order Tracking Board:**
  - Visual breadcrumb stepper on customer dashboard:
    `Order Received` ➔ `In Kitchen (Baking)` ➔ `Sent to Delivery (On the Way)` ➔ `Delivered`.
  - Updates in real-time via WebSocket / Server-Sent Events without manual page refresh.

### 3.3 Admin Dashboard & Inventory Automation
* **Live Inventory Cockpit:**
  - Categorized grid: Bases, Sauces, Cheeses, Vegetables.
  - High-density visual indicators: Green (Safe), Yellow (Low Stock Warning), Red (Depleted).
  - Real-time stock counters.
* **Atomic Stock Decrement:**
  - Every successful order placement triggers an atomic MongoDB `$inc` query decrementing the exact quantities used (1 base, 1 portion sauce, 1 portion cheese, 1 portion each selected veggie).
* **Manual Stock Replenishment:**
  - Quick "+20 Restock", "+50 Restock", or custom input counter for each item with instant persistence.
* **Automated Low-Stock Alert Engine (`node-cron`):**
  - Scheduled background worker running on a configurable cron cadence (e.g. every 5 minutes / hourly, and on-demand trigger).
  - Checks if any item's stock count is `<= threshold` (default: 20 units).
  - Automatically drafts and dispatches an emergency notification email to the admin via Nodemailer.
  - Deduplicates alerts so the admin isn't spammed with repetitive emails.
* **Live Order Dispatch Board:**
  - Real-time stream of incoming customer orders.
  - Single-click action buttons to advance state:
    `Mark as In Kitchen` ➔ `Mark as Sent to Delivery` ➔ `Mark as Completed`.
  - Instantly broadcasts update payload to customer's active session.

---

## 4. Technical Constraints & Acceptance Criteria Matrix

| Oasis Requirement | Acceptance Criteria | Verification Method |
| :--- | :--- | :--- |
| **Email Verification** | New user gets token link; cannot log in until verified (or auto-bypassable with dev toggle) | API test + UI flow |
| **JWT Authorization** | Protected routes reject requests lacking valid Bearer token with 401 | Vitest / Postman |
| **Password Reset** | Tokenized link expires in 15 mins; updates bcrypt hash | Automated test |
| **5 Bases & 5 Sauces** | Exactly 5 distinct choices for base and sauce available in builder | UI & DB Seed |
| **Cheese & Multi-Veggie** | Single select for cheese, multiple toggle for veggies | UI builder test |
| **Razorpay Test Mode** | Test modal loads, accepts test cards/success button, verifies payment ID | Browser test |
| **Real-Time Order Tracker** | Order status changes in Admin update User screen without page reload | WebSocket test |
| **Isolated Admin Login** | Non-admins cannot access `/admin` paths | Route guard check |
| **Stock Auto-Decrement** | Base, sauce, cheese, veggies quantities drop by 1 upon order payment | DB query inspection |
| **Manual Stock Update** | Admin can adjust inventory quantities dynamically | Admin UI action |
| **Low-Stock Email Alert** | Stock < 20 fires automated email via `node-cron` & Nodemailer | Cron runner test |

---

## 5. UI/UX Strategy: The Figma Handoff Gate

Per project instructions:
* **Phase 1:** Deliver fully validated Database schemas, API endpoints, Authentication, Razorpay test integration, Inventory atomic operations, and Cron email alerts.
* **Phase 2:** Produce comprehensive, pixel-perfect **Figma Prompts & Design Token Specs** for the user to generate/compose the UI in Figma.
* **Phase 3:** Translate the Figma screens into responsive, high-aesthetic React components matching the DesignCode / ThreeUI glassmorphism design system.
