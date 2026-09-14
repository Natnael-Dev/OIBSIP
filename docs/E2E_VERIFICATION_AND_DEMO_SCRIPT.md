# End-to-End Verification & Screen-Recording Demo Script

## Objective: 100% Flawless Evaluation Gate Delivery
**Track:** Oasis Infobyte SIP — Web Development & Designing (Level 3)  
**Evaluator Focus:** Complete functionality, zero mock stubs, and strict compliance with the 2-second title card rule.  

---

## 1. Automated System Health & Integration Verification

Before recording the walkthrough video, run this verification checklist in your terminal:

```bash
# 1. Start Server in Terminal 1
cd WebDev-L3-PizzaDelivery/server
npm run dev

# 2. Verify Health Endpoint
curl -X GET http://localhost:5000/api/health
# Expected: { "status": "online", "internshipTrack": "Web Development & Designing (Level 3)" }

# 3. Verify Database Seeded Items
curl -X GET http://localhost:5000/api/inventory
# Expected: Returns 5 bases, 5 sauces, cheeses, and veggies

# 4. Verify Signature Pizzas Catalog
curl -X GET http://localhost:5000/api/pizzas
# Expected: Returns Margherita Royale, Truffle Funghi, Diavola, Verde Pesto
```

---

## 2. The Official Demo Video Walkthrough Script (Step-by-Step)

Follow this exact chronological script when recording your screen to ensure every single Oasis Infobyte grading item is demonstrated.

### ⏱️ 0:00 – 0:02 · Mandatory Static Title Card (STRICT REQUIREMENT)
> ⚠️ **DO NOT SKIP OR ANIMATE:** Keep this static frame on screen for the full first 2 seconds:
> ```
> =======================================================
> INTERN NAME: Natnael Tezazu
> ASSIGNED TRACK: Web Development & Designing
> TASK TITLE: Level 3 - Task 1: Pizza Delivery Full-Stack Application
> PROJECT: Crust & Craft (MERN Production Engine)
> ORGANIZATION: Oasis Infobyte Student Internship Program (OIB-SIP)
> =======================================================
> ```

---

### ⏱️ 0:03 – 0:35 · Phase 1: Customer Onboarding & Menu Showcase
1. **Show Landing Page:**
   - Display the high-contrast dark luxury hero section with the floating glowing pizza, gradient branding, and badges (*"48h Fermented Sourdough"*, *"San Marzano DOP"*).
2. **Show Curated Menu:**
   - Scroll through the 4 signature pizzas (*Margherita Royale, Truffle & Wild Funghi, Diavola Piccante, Verde Pesto Harvest*).
   - Point out dietary tags (*"Vegetarian"*, *"Gluten-Free"*, *"Spicy"*).
3. **Show Authentication:**
   - Click "Login / Register".
   - Demonstrate quick login using `natnael@crustcraft.com`.

---

### ⏱️ 0:36 – 1:25 · Phase 2: The 4-Step Custom Pizza Builder (The Crown Jewel)
1. Click **"Build Your Custom Pizza"**.
2. **Step 1 (Base):** Click through the 5 bases (*Hand-Tossed, Thin Crust, Sourdough, Gluten-Free, Stuffed Crust*). Select **Rustic Sourdough**. Point out the price updating to `$15.00`.
3. **Step 2 (Sauce):** Click through the 5 sauces (*Marinara, Arrabiata, Alfredo, BBQ, Basil Pesto*). Select **Fiery Arrabiata**. Point out the spicy badge and price update.
4. **Step 3 (Cheese):** Select **Fior di Latte Mozzarella**.
5. **Step 4 (Toppings):** Multi-select **Slow-Caramelized Onions** and **Kalamata Black Olives**.
6. **Point out the dynamic visual summary:** Show the live visual canvas, itemized price breakdown, and total: `$17.50`.
7. Click **"Add Custom Pizza to Cart"** ➔ Toast notification appears with spring animation.

---

### ⏱️ 1:26 – 2:05 · Phase 3: Checkout & Razorpay Test Payment
1. Open the Cart Drawer.
2. Review the invoice: Subtotal ($17.50), Tax 8% ($1.40), Delivery Fee ($3.50), **Total: $22.40**.
3. Enter delivery address: `42 Tech Boulevard, Suite 100` and contact phone.
4. Click **"Proceed to Payment (Razorpay Test Mode)"**.
5. Show the official Razorpay test modal loading.
6. Click **"Simulate Success / Test Payment"**.
7. Payment confirms with green checkmark animation ➔ Automatically redirects to the **Live Order Tracking Page** with Order Number (e.g. `CC-91820`).

---

### ⏱️ 2:06 – 2:50 · Phase 4: Real-Time WebSocket Kitchen Synchronization (Side-by-Side)
1. **Open two browser windows side-by-side:**
   - **Left Window:** Customer Live Tracking Page (`CC-91820`). Status is currently **"Order Received"**.
   - **Right Window:** Admin Operations Portal (`/admin`).
2. Log into Admin with `admin@crustcraft.com` / `AdminSecret2026!`.
3. Go to **Incoming Orders Dispatch Board**. Point out order `CC-91820` appears at the top.
4. In Admin, click **"Advance to: In Kitchen (Baking)"**.
5. **LOOK AT LEFT WINDOW:** Customer stepper immediately glows amber and advances to **"In Kitchen"** with the live oven beacon pulsating — **without any page refresh!**
6. In Admin, click **"Advance to: Out for Delivery"**.
7. Customer stepper immediately updates to **"Out for Delivery"** showing the driver tracking illustration.

---

### ⏱️ 2:51 – 3:30 · Phase 5: Admin Inventory Automation & node-cron Audit
1. In the Admin window, switch to the **Live Inventory Dashboard**.
2. **Demonstrate Atomic Decrement:**
   - Point out that *Rustic Sourdough*, *Arrabiata*, *Mozzarella*, *Onions*, and *Olives* each dropped by 1 unit from the order just placed!
3. **Demonstrate Manual Stock Replenishment:**
   - Click the `+20 Restock` button on *Rustic Sourdough* ➔ stock immediately updates in the database.
4. **Demonstrate Scheduled Low-Stock Automation (`node-cron`):**
   - Click **"Trigger node-cron Audit"** or show server terminal logs.
   - Point out the terminal log:  
     `[Cron: Inventory Monitor] 🚨 Items breached threshold! Dispatching alert email...`
   - Open Ethereal / simulated email viewer and show the received **Low Stock Alert Email** with the itemized alert table.
5. End video with a closing slide: *"Built for Oasis Infobyte SIP — Level 3 Full-Stack Mastery."*
