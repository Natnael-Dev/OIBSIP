# Codebase Structure & Component Integration Standards

## System Directory Architecture
**Monorepo Root:** `OIBSIP/`  
**Application Root:** `OIBSIP/WebDev-L3-PizzaDelivery/`  

---

## 1. Directory Tree & Module Boundaries

```
OIBSIP/
├── WebDev-L3-PizzaDelivery/
│   ├── README.md                              <-- Project setup, credentials & feature checklist
│   ├── package.json                           <-- Monorepo root scripts (dev:all, build, seed)
│   │
│   ├── server/                                <-- Production Node.js + Express Backend
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── server.js                          <-- Express entry point + Socket.io + Cron
│   │   ├── config/
│   │   │   ├── db.js                          <-- Mongoose connection pool
│   │   │   └── razorpay.js                    <-- Razorpay SDK instance & HMAC verifier
│   │   ├── controllers/
│   │   │   ├── authController.js              <-- Register, login, adminLogin, verify, reset
│   │   │   ├── inventoryController.js         <-- Stock queries, manual update, thresholds
│   │   │   ├── orderController.js             <-- Checkout, Razorpay orders, atomic decrement
│   │   │   └── pizzaController.js             <-- Signature pizza catalog
│   │   ├── middleware/
│   │   │   ├── auth.js                        <-- JWT validation
│   │   │   └── roleGuard.js                   <-- Admin RBAC enforcement
│   │   ├── models/
│   │   │   ├── User.js                        <-- Customer & Admin credentials
│   │   │   ├── InventoryItem.js               <-- Bases, Sauces, Cheeses, Veggies
│   │   │   ├── Pizza.js                       <-- Signature recipes
│   │   │   └── Order.js                       <-- Orders, items, payment & live status
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── inventory.js
│   │   │   ├── orders.js
│   │   │   └── pizzas.js
│   │   ├── services/
│   │   │   ├── cronService.js                 <-- node-cron scheduled inventory watcher
│   │   │   ├── emailService.js                <-- Nodemailer low-stock alert dispatcher
│   │   │   └── socketService.js               <-- Socket.io room dispatcher
│   │   └── seed/
│   │       └── seedData.js                    <-- Seeds 5 bases, 5 sauces, cheeses, veggies, admin
│   │
│   └── client/                                <-- Modern React Client (Vite + Tailwind)
│       ├── package.json
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx                       <-- Root React DOM entry
│           ├── App.jsx                        <-- App router & layout container
│           ├── index.css                      <-- Tailwind directives & glassmorphism utility classes
│           │
│           ├── context/
│           │   ├── AuthContext.jsx            <-- User/Admin session state & login/logout
│           │   ├── CartContext.jsx            <-- Cart items, subtotal, tax, delivery calculations
│           │   └── SocketContext.jsx          <-- Real-time Socket.io listener & room bindings
│           │
│           ├── services/
│           │   ├── api.js                     <-- Axios/Fetch wrapper with Bearer token interceptor
│           │   ├── authService.js             <-- Auth API calls
│           │   ├── inventoryService.js        <-- Ingredient & stock API calls
│           │   └── orderService.js            <-- Order checkout & tracking API calls
│           │
│           ├── components/
│           │   ├── common/                    <-- Reusable UI Primitives
│           │   │   ├── Navbar.jsx             <-- Glassmorphic top navigation
│           │   │   ├── Footer.jsx             <-- Footer with track & developer credits
│           │   │   ├── Button.jsx             <-- Tactile button with loading spinner
│           │   │   ├── Modal.jsx              <-- Accessible modal backdrop
│           │   │   └── Toast.jsx              <-- Floating feedback notifications
│           │   │
│           │   ├── builder/                   <-- The 4-Step Modular Pizza Builder
│           │   │   ├── PizzaBuilder.jsx       <-- Builder parent container & state machine
│           │   │   ├── PizzaCanvas.jsx        <-- Visual circular pan with dynamic layer preview
│           │   │   ├── BaseSelector.jsx       <-- Step 1: 5 Pizza Bases radio cards
│           │   │   ├── SauceSelector.jsx      <-- Step 2: 5 Sauces with spicy indicators
│           │   │   ├── CheeseSelector.jsx     <-- Step 3: Artisanal Cheeses single-select
│           │   │   ├── VeggieSelector.jsx     <-- Step 4: Garden Veggies multi-toggle cards
│           │   │   └── BuilderSummary.jsx     <-- Live cost counter & Add to Cart button
│           │   │
│           │   ├── menu/                      <-- Signature Pizzas Showcase
│           │   │   ├── PizzaMenu.jsx          <-- Menu grid container
│           │   │   └── PizzaCard.jsx          <-- Card with image, dietary badges & quick add
│           │   │
│           │   ├── checkout/                  <-- Order Review & Payment
│           │   │   ├── CartDrawer.jsx         <-- Slide-over cart drawer
│           │   │   ├── CheckoutModal.jsx      <-- Address inputs & summary invoice
│           │   │   └── RazorpayModal.jsx      <-- Official Razorpay script trigger & test simulation
│           │   │
│           │   ├── tracker/                   <-- Real-Time Status Tracking
│           │   │   ├── OrderTracker.jsx       <-- Status tracker container
│           │   │   ├── StatusStepper.jsx      <-- Glowing 4-step progress line
│           │   │   └── LiveDeliveryMap.jsx    <-- Animated courier illustration
│           │   │
│           │   └── admin/                     <-- Isolated Admin Portal
│           │       ├── AdminDashboard.jsx     <-- Main admin cockpit
│           │       ├── InventoryTable.jsx     <-- Live stock meters with +20 restock triggers
│           │       ├── OrderDispatchBoard.jsx <-- Incoming order queue with status buttons
│           │       └── StatCards.jsx          <-- KPI cards (Revenue, Active Orders, Stock Health)
│           │
│           └── pages/
│               ├── HomePage.jsx               <-- Hero + Menu + Builder CTA
│               ├── BuilderPage.jsx            <-- Dedicated Custom Builder view
│               ├── TrackingPage.jsx           <-- Public/Customer tracking view
│               ├── LoginPage.jsx              <-- Customer login/register
│               └── AdminLoginPage.jsx         <-- Isolated admin authentication view
```

---

## 2. Drop-in Contract for Figma-Generated Code

When you paste the Figma prompts into Figma or generate the UI, the output code directly slots into the components above with these clean prop contracts:

### 2.1 `BaseSelector.jsx` (Step 1)
* **Props:** `bases: Array<Ingredient>`, `selectedBase: Ingredient`, `onSelect: (base) => void`
* **Expectation:** Renders exactly 5 cards with base name, unit price, stock indicator, and active glowing border.

### 2.2 `SauceSelector.jsx` (Step 2)
* **Props:** `sauces: Array<Ingredient>`, `selectedSauce: Ingredient`, `onSelect: (sauce) => void`
* **Expectation:** Renders exactly 5 cards with sauce name, price, and spicy/mild badge.

### 2.3 `CheeseSelector.jsx` (Step 3)
* **Props:** `cheeses: Array<Ingredient>`, `selectedCheese: Ingredient`, `onSelect: (cheese) => void`
* **Expectation:** Single-select radio cards.

### 2.4 `VeggieSelector.jsx` (Step 4)
* **Props:** `veggies: Array<Ingredient>`, `selectedVeggies: Array<Ingredient>`, `onToggle: (veggie) => void`
* **Expectation:** Multi-select toggle pills/checkboxes.

### 2.5 `StatusStepper.jsx` (Live Tracker)
* **Props:** `currentStatus: 'received' | 'in_kitchen' | 'sent_to_delivery' | 'delivered'`
* **Expectation:** Advances glowing active node in real time as WebSocket pushes updates.

### 2.6 `InventoryTable.jsx` (Admin Operations)
* **Props:** `inventory: Array<Ingredient>`, `onRestock: (id, amount) => void`, `onTriggerAudit: () => void`
* **Expectation:** Table with color-coded stock pills (Green, Yellow, Red) and quick `+20` / `+50` restock buttons.
