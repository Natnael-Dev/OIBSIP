# Figma UI Design System & Comprehensive Prompts Suite

## Project: Crust & Craft (Level 3 Full-Stack Platform)
**Target Tool:** Figma / Figma AI / UI Component Generator  
**Aesthetic Standard:** World-Class Artisanal Glassmorphism & High-Contrast Tactile UI (Inspired by DesignCode & ThreeUI)  
**Theme:** Dark Luxury Culinary / High-End Pizzeria  

---

## 🎨 1. Global Design System Tokens

### 1.1 Color Palette
* **Canvas Backgrounds:**
  - `bg-base-950`: `#080B11` (Deep Space Obsidian)
  - `bg-surface-900`: `#0F172A` (Rich Navy Slate)
  - `bg-glass-overlay`: `rgba(15, 23, 42, 0.65)` (with `backdrop-filter: blur(16px)`)
* **Brand Accents & Gradients:**
  - **Artisanal Flame (Primary):** Linear gradient from `#F59E0B` (Warm Amber) to `#EA580C` (Fiery Paprika)
  - **Gourmet Gold (Secondary):** `#FBBF24`
* **Semantic Status Colors:**
  - **Fresh Sage (Safe Stock / Verified):** `#10B981` (Emerald)
  - **Alert Saffron (Low Stock Warning):** `#F59E0B`
  - **Crimson Heat (Out of Stock / Critical):** `#EF4444`
  - **Neon Cyan (Live WebSockets / Active Tracking):** `#06B6D4`
* **Typography:**
  - **Display / Headings:** `Plus Jakarta Sans`, bold & semibold, tight tracking (`letter-spacing: -0.02em`)
  - **Body / Metadata:** `Inter` or `Geist Sans`, regular & medium, high legibility

---

## 🖼️ 2. Detailed Screen-by-Screen Figma Prompts

You can paste these exact prompts into Figma AI, use them as your blueprint in Figma, or generate visual artboards.

---

### Prompt 1: Artisanal Home & Signature Menu Showcase
> **Prompt for Figma:**
> *"Create an ultra-luxurious dark-mode desktop landing page (1440x1024) for 'Crust & Craft' artisanal pizza kitchen. 
> 
> **Header:** Floating glassmorphic navbar with a glowing flame logo, navigation links ('Menu', 'Custom Builder', 'Track Order', 'Admin Portal'), and a pill-shaped button 'Build Your Pizza' with an orange-to-amber gradient glow.
> 
> **Hero Section:** Left side has a bold headline 'Precision Crafted Artisanal Pizza, Baked on Demand' with an amber gradient accent on 'Baked on Demand', a subtitle describing sourdough crusts and farm-fresh ingredients, and two CTA buttons: 'Order Signature' and 'Start Custom Pizza (4-Steps)'. Right side features a floating 3D-styled hero pizza on a slate wooden peel with steam micro-effects and floating ingredient badges ('48h Fermented', 'San Marzano DOP').
> 
> **Signature Menu Section:** A 4-column card grid showing pre-configured pizzas:
> 1. 'Margherita Royale' ($14.50, Bestseller badge, hand-tossed base tag)
> 2. 'Truffle & Wild Funghi' ($18.00, Chef Special badge, rustic sourdough tag)
> 3. 'Diavola Piccante' ($16.50, Spicy badge with chili icon)
> 4. 'Verde Pesto Harvest' ($17.50, Gluten-Free badge)
> Each card features high-contrast dark slate styling (`#1E293B`), an image container with rounded corners, ingredient pills, price in bold gold, and an 'Add to Cart' quick button."*

---

### Prompt 2: Interactive 4-Step Modular Pizza Builder (The Crown Jewel)
> **Prompt for Figma:**
> *"Design a high-density, interactive 4-step custom pizza builder studio (1440x960).
> 
> **Layout:** Split-screen layout.
> - **Left Column (40% width) - Live Visual Preview Canvas:**
>   A circular pizza pan displaying an interactive visual representation of the pizza being constructed. Above the pizza, display a floating dynamic price counter: '$17.50' that animates when toppings are added. Underneath the canvas, display a live nutrition & ingredient summary card listing currently selected: Crust (Rustic Sourdough), Sauce (Fiery Arrabiata), Cheese (Fior di Latte), and Veggies (Olives, Caramelized Onions).
> 
> - **Right Column (60% width) - The 4-Step Tabbed Configurator:**
>   A top progress bar showing: Step 1 (Base) ➔ Step 2 (Sauce) ➔ Step 3 (Cheese) ➔ Step 4 (Veggies).
>   
>   - **Step 1: Choose Your Base (5 Options):**
>     A grid of 5 selectable radio cards:
>     1. 'Classic Hand-Tossed' (+$4.00, Stock: 60)
>     2. 'Thin Crust Crispy' (+$4.50, Stock: 45)
>     3. 'Rustic Sourdough' (+$5.00, Stock: 35, Selected state with orange glowing border)
>     4. 'Gluten-Free Cauliflower' (+$5.50, Stock: 25)
>     5. 'Cheesy Garlic Stuffed' (+$6.00, Stock: 30)
>   
>   - **Step 2: Choose Your Sauce (5 Options):**
>     Cards for San Marzano Marinara, Fiery Arrabiata (chili icon), Roasted Garlic Alfredo, Smoky BBQ, Basil Pesto.
>   
>   - **Step 3: Artisanal Cheese (Single Select):**
>     Cards for Fior di Latte Mozzarella, Sharp Aged Cheddar, Smoked Gouda, Fresh Ricotta, Vegan Cashew Cheese.
>   
>   - **Step 4: Garden Toppings (Multi-Select):**
>     Toggle cards with checkboxes for Sweet Bell Peppers, Caramelized Onions, Kalamata Olives, Pickled Jalapeños, Button Mushrooms, Sun-Dried Tomatoes.
> 
>   **Footer Action Bar:** A sticky bottom tray with 'Total: $17.50', an 'Add to Cart' button with ripple effect, and a secondary 'Reset Builder' link."*

---

### Prompt 3: Order Review & Razorpay Checkout Modal
> **Prompt for Figma:**
> *"Design an elegant checkout drawer and modal overlay (1440x900).
> 
> - **Checkout Sheet:**
>   Itemized invoice showing:
>   - Custom Pizza (Rustic Sourdough + Arrabiata + Mozzarella + Olives/Onions): $17.50
>   - Subtotal: $17.50
>   - State Tax (8%): $1.40
>   - Delivery Fee: $3.50
>   - **Total Payable:** $22.40
>   - Delivery Address input with pin icon, Contact Phone input.
>   - Primary CTA: 'Pay with Razorpay (Test Mode)' in vibrant blue/indigo with the Razorpay official badge.
> 
> - **Payment Simulation Modal (Test Mode):**
>   A centered glassmorphic card mimicking Razorpay's test modal with:
>   - Header: 'Razorpay Checkout — Crust & Craft Order #CC-84920'
>   - Amount: '₹1,850 / $22.40'
>   - Test payment selector: 'Simulate Card (4111...)', 'Simulate UPI', and a green 'Success' test button."*

---

### Prompt 4: Real-Time Live Order Status Tracker
> **Prompt for Figma:**
> *"Design a real-time order tracking dashboard (1440x900) for active customers.
> 
> - **Header Banner:** 'Order #CC-84920 Confirmed!' with a glowing green badge 'Live WebSocket Connected'.
> - **Visual Stepper Timeline (Horizontal with glowing nodes):**
>   1. **Step 1: Order Received** (Checkmark icon, Completed green, timestamp: 12:00 PM)
>   2. **Step 2: In Kitchen / Baking** (Pizza oven flame icon, Active Glowing Amber with pulsing beacon ring, 'Chef Marco is tossing your sourdough crust')
>   3. **Step 3: Sent to Delivery** (Scooter / bike icon, Pending gray)
>   4. **Step 4: Delivered** (Home door icon, Pending gray)
> - **Live Delivery Map Simulation:** A dark-mode map snippet showing an animated scooter moving towards the delivery destination, with 'Estimated Time Remaining: 18 Minutes'.
> - **Order Details Summary:** Accordion showing full ingredient breakdown and contact helpline."*

---

### Prompt 5: Isolated Admin Operations Cockpit (Store Manager)
> **Prompt for Figma:**
> *"Design a powerful, high-density dark administrative dashboard (1440x1024) for store operations.
> 
> **Top Navigation:** 'Crust & Craft — Admin Ops Cockpit', Admin Avatar ('Natnael Tezazu - Operations Director'), and a glowing 'Low Stock Alert (2)' notification bell.
> 
> **Row 1 - KPI Summary Cards:**
> - 'Today Orders': 48 (+12% vs yesterday)
> - 'Active in Kitchen': 6
> - 'Total Revenue': $1,240.50
> - 'Inventory Health': 94% (2 items below threshold)
> 
> **Row 2 - Real-Time Inventory Control Table (The Oasis Mandate):**
> A dense table with columns:
> `Ingredient Name` | `Category` | `Stock Remaining` | `Alert Threshold` | `Status Indicator` | `Quick Action`
> - Example Rows:
>   - Thin Crust Crispy (Base, 18 units, Threshold: 20, **Warning Yellow Pill**, `+20 Restock` button)
>   - San Marzano Marinara (Sauce, 94 units, Threshold: 20, **Safe Green Pill**, `+20 Restock` button)
>   - Fresh Ricotta (Cheese, 8 units, Threshold: 20, **Critical Red Pill**, `+50 Restock` button)
>   - Sun-Dried Tomatoes (Veggie, 45 units, Threshold: 20, **Safe Green Pill**)
> Above the table, an action button: 'Trigger node-cron Audit Now' to simulate the automated email test.
> 
> **Row 3 - Live Order Fulfillment Dispatch Board:**
> A Kanban-style or live streaming table of incoming orders with action buttons:
> - Order #CC-84920 ($22.40) ➔ Button: 'Move to In Kitchen' (transitions user screen live).
> - Order #CC-84918 ($18.00) ➔ Button: 'Dispatch to Delivery'."*

---

## 3. Next Steps: Figma Handoff Execution

1. **Review and Use Prompts:** You can now take these prompts directly into Figma or use them as your blueprint.
2. **Ready for Frontend Implementation:** As soon as you give the signal, we will implement the React frontend matching this exact visual architecture, wire it to the live backend API and WebSockets, and conduct the full end-to-end demo!
