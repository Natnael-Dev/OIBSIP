# Autonomous Engineering Agent Instructions (`agent.md`)

## Mission Objective
Build, verify, and document **Level 3 Task 1: Pizza Delivery Full-Stack Application** (`Crust & Craft`) for the **Oasis Infobyte Student Internship Program (Web Development & Designing)**.

---

## 1. Project Directory & Repository Structure

To strictly comply with Section 1.3 of the Oasis Infobyte syllabus, all code lives within the `OIBSIP` structure:

```
OIBSIP/
└── WebDev-L3-PizzaDelivery/
    ├── README.md                          <-- Project overview, live demo, setup instructions
    ├── package.json
    ├── .env.example
    ├── server/                            <-- Node.js + Express + MongoDB Backend
    │   ├── config/
    │   │   ├── db.js                      <-- Mongoose connection
    │   │   └── razorpay.js                <-- Razorpay SDK instance
    │   ├── controllers/
    │   │   ├── authController.js          <-- Register, verify, login, reset-password
    │   │   ├── inventoryController.js     <-- Stock queries, manual update, thresholds
    │   │   ├── orderController.js         <-- Order placement, Razorpay initiate & verify
    │   │   └── pizzaController.js         <-- Preset pizza varieties catalog
    │   ├── middleware/
    │   │   ├── auth.js                    <-- JWT verification
    │   │   └── roleGuard.js               <-- Admin isolation check
    │   ├── models/
    │   │   ├── User.js                    <-- Customer & Admin credentials
    │   │   ├── InventoryItem.js           <-- Bases, sauces, cheeses, veggies
    │   │   ├── Pizza.js                   <-- Signature menu items
    │   │   └── Order.js                   <-- Itemized order, payment, live status
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── inventory.js
    │   │   ├── orders.js
    │   │   └── pizzas.js
    │   ├── services/
    │   │   ├── cronService.js             <-- node-cron automated low-stock audit
    │   │   ├── emailService.js            <-- Nodemailer low-stock alert & reset links
    │   │   └── socketService.js           <-- WebSocket server for real-time status updates
    │   ├── seed/
    │   │   └── seedData.js                <-- Seeds 5 bases, 5 sauces, cheeses, veggies, pizzas, admin
    │   └── server.js                      <-- App entry point + Socket.io attachment
    │
    └── client/                            <-- Modern React Frontend (Figma-Driven)
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   │   ├── common/                <-- Navbar, Footer, Badge, Button, Toast
        │   │   ├── builder/               <-- 4-Step Modular Pizza Builder (Base, Sauce, Cheese, Veggies)
        │   │   ├── catalog/               <-- Preset Pizza Showcase
        │   │   ├── checkout/              <-- Order Summary & Razorpay Modal Trigger
        │   │   ├── tracker/               <-- Real-time Visual Order Status Stepper
        │   │   └── admin/                 <-- Stock Dashboard, Restock Modal, Order Dispatch Board
        │   ├── context/                   <-- AuthContext, CartContext, SocketContext
        │   ├── services/                  <-- Axios / Fetch API client
        │   ├── App.jsx
        │   └── index.css
```

---

## 2. Phased Execution Roadmap

### 🏁 Phase 1: Backend Architecture, Database & Business Logic
1. **Initialize Backend Structure:** Scaffold Express server with CORS, JSON parser, and dotenv.
2. **Database Modeling:** Define Mongoose schemas (`User`, `InventoryItem`, `Pizza`, `Order`).
3. **Database Seeding (`seedData.js`):**
   - 5 Pizza Bases: *Hand-Tossed, Thin Crust, Sourdough, Cauliflower Gluten-Free, Cheesy Stuffed Crust*.
   - 5 Sauces: *Marinara, Spicy Arrabiata, Garlic Alfredo, Smoky BBQ, Basil Pesto*.
   - Cheeses: *Mozzarella, Aged Cheddar, Smoked Gouda, Ricotta, Vegan Cashew Cheese*.
   - Veggies: *Bell Peppers, Onions, Black Olives, Jalapeños, Mushrooms, Sun-Dried Tomatoes*.
   - Pre-configured signature pizzas.
   - Default Admin account (`admin@crustcraft.com`).
4. **Authentication Engine:**
   - Register, email token generation, login with JWT, forgot-password token flow.
   - Admin login endpoint with strict role verification.
5. **Inventory & Order Controller:**
   - Real-time stock querying.
   - Atomic decrement query on payment verification.
   - Manual admin stock update endpoint.
6. **Background Automation:**
   - Setup `node-cron` to audit stock levels against `threshold` (default <= 20).
   - Configure `nodemailer` to dispatch alerts on threshold breaches.
7. **Payment Gateway Integration:**
   - Razorpay test mode SDK integration for order creation & HMAC-SHA256 signature verification.
8. **Real-time Engine:**
   - WebSocket (`socket.io`) emitting `order:status_updated` and `admin:new_order`.

---

### 🎨 Phase 2: Design Handoff to Figma
> ⚠️ **GATEWAY STEP:** Once Phase 1 is validated and operational, STOP.
> Present the user with comprehensive **Figma Prompts and Design Specifications** covering:
> 1. Design tokens (Color palette, typography, radii, elevation).
> 2. Customer Screens:
>    - Landing & Menu catalog
>    - 4-Step Custom Pizza Builder with live 3D-styled visual canvas and ingredient summary
>    - Order Review & Razorpay checkout sheet
>    - Real-time order tracker timeline (`Received` ➔ `In Kitchen` ➔ `Out for Delivery` ➔ `Delivered`)
> 3. Admin Screens:
>    - Metric summary cards (Total Orders, Pending, Revenue)
>    - Inventory management table with low-stock status pills and "+20 Quick Restock" triggers
>    - Live order dispatch Kanban board with status action buttons
> 
> *The user creates or refines the UI layout in Figma based on these prompts.*

---

### 💻 Phase 3: Frontend Implementation (Translating Figma to React)
1. Initialize React frontend (Vite).
2. Wire up Design Tokens and component styling based on the user's Figma designs.
3. Build customer builder state machine:
   - Step 1 (Bases) ➔ Step 2 (Sauces) ➔ Step 3 (Cheeses) ➔ Step 4 (Veggies).
   - Dynamic price calculation.
4. Integrate Razorpay Checkout JS SDK into checkout flow.
5. Implement live WebSocket listener for instant order status transitions.
6. Build Admin cockpit:
   - Inventory table with live stock counters and update buttons.
   - Order control panel to advance status in one click.

---

### 🚀 Phase 4: Final Verification, Video Recording & Submission
1. End-to-end integration test:
   - Create user ➔ Build custom pizza ➔ Complete test checkout ➔ Verify inventory decrements ➔ Verify admin receives order ➔ Update status to In Kitchen ➔ Verify customer UI updates live.
   - Trigger low-stock threshold ➔ Verify automated email is sent.
2. Record Demo Video:
   - **Enforce 2-second title card:** Name: `Natnael Tezazu`, Track: `Web Development & Designing`, Task: `Level 3 - Task 1: Pizza Delivery Full-Stack Application`.
3. Push to `https://github.com/Natnael-Dev/OIBSIP`.
4. Prepare LinkedIn post copy and submission links.

---

## 3. Engineering Quality Rules
* **No AI Slop:** Write clean, modular, production-grade code. No mock buttons that don't do anything.
* **Graceful Fallbacks:** If external services (like Razorpay test network or SMTP) are unreachable offline, provide automated local simulation modes so tests and demos run 100% reliably.
* **Resilience:** Validate all inputs on both frontend and backend.
