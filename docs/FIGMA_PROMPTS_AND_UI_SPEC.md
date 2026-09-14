# Figma UI Design System & Master Prompt Suite (Ready for Copy-Paste)

## How to Use This Document
1. Copy the prompts below into **Figma AI**, **Figma plugins (e.g. Builder.io, Locofy, Anima, or Claude for Figma)**, or use them as your blueprint to design the screens in Figma.
2. Generate/export the **React + Tailwind CSS** code from Figma.
3. Paste the code back here, and we will automatically slot it into the pre-built component architecture (`src/components/builder/`, `src/components/admin/`, etc.) and connect it to the live backend API!

---

## 🎨 Global Design Tokens & Tailwind Palette

```javascript
// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        crust: {
          dark: '#080B11',       // Canvas background
          card: '#0F172A',       // Elevated glass card
          border: '#1E293B',     // Subtle card border
          amber: '#F59E0B',      // Warm cheese/crust glow
          paprika: '#EA580C',    // Fiery primary accent
          sage: '#10B981',       // Safe stock / Fresh veggie
          crimson: '#EF4444',    // Low stock alert / Out of stock
          cyan: '#06B6D4'        // Real-time live status beacon
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  }
}
```

---

## 📋 MASTER FIGMA PROMPTS (COPY-PASTE READY)

---

### 🍕 PROMPT 1: Home Page & Signature Pizza Menu
```text
Design an ultra-luxurious, dark-mode desktop landing page (1440x1024) for "Crust & Craft", an artisanal craft pizza kitchen.

1. TOP NAVBAR:
- Fixed glassmorphism header with a dark slate background (rgba(15, 23, 42, 0.75)) and a 1px border (#1E293B).
- Left: Glowing orange flame icon + bold brand name "Crust & Craft" (font: Plus Jakarta Sans).
- Center Links: "Signature Menu", "Custom Builder (4-Steps)", "Live Tracker", "Admin Ops".
- Right: Cart button with a pill badge ("3 items • $22.40") and a "Sign In" button with an amber border.

2. HERO SECTION:
- Left Column: Bold hero headline: "Precision Crafted Artisanal Pizza, Baked on Demand" with a vibrant fiery gradient on "Baked on Demand". Subtitle: "48-hour fermented sourdough bases, San Marzano DOP tomatoes, and hand-selected garden toppings."
- Two CTA buttons:
  - Primary CTA: "Launch 4-Step Custom Builder" (gradient background #EA580C to #F59E0B, rounded-xl, glowing drop shadow).
  - Secondary CTA: "Explore Signature Pizzas" (dark outline with #F59E0B text).
- Right Column: High-resolution floating 3D-styled pizza on a dark rustic wooden board with rising steam particles and 3 floating badge pills: "48h Fermented Crust", "Wood-Fired at 450°C", "100% Organic".

3. SIGNATURE PIZZA CATALOG (4-Card Grid):
- Display 4 high-contrast cards with rounded-2xl borders and dark slate backgrounds (#0F172A):
  1. Margherita Royale ($14.50) - Hand-tossed base, San Marzano sauce, fresh mozzarella, sweet basil. Badge: "Bestseller".
  2. Truffle & Wild Funghi ($18.00) - Rustic sourdough base, garlic alfredo sauce, smoked gouda, button mushrooms. Badge: "Chef's Special".
  3. Diavola Piccante ($16.50) - Crispy thin crust, fiery arrabiata, aged cheddar, pickled jalapeños. Badge: "Spicy 🔥".
  4. Verde Pesto Harvest ($17.50) - Cauliflower crust, basil pesto, ricotta dollops, kalamata olives. Badge: "Gluten-Free".
- Each card has a crisp food image, ingredient pills, price in bold gold, and an "Add to Cart" button.
```

---

### 🛠️ PROMPT 2: The 4-Step Modular Pizza Builder (The Crown Jewel)
```text
Design a split-screen interactive 4-Step Pizza Builder Studio (1440x960) with high visual density and real-time feedback.

LEFT COLUMN (40% Width - Live Visual Preview Pan):
- A dark granite round pizza stone canvas displaying an interactive visual representation of a pizza.
- As ingredients are selected on the right, visual badges and ingredient icons pop onto the pizza canvas.
- A floating frosted glass price badge in the top-right corner showing: "$17.50" with a small subtitle "Calculated in Real-Time".
- Bottom Recipe Summary Card: An itemized chip list showing:
  - Crust: Rustic Sourdough (+$5.00)
  - Sauce: Fiery Arrabiata (+$1.80)
  - Cheese: Fior di Latte Mozzarella (+$2.50)
  - Veggies: Kalamata Olives (+$1.50), Caramelized Onions (+$1.20)
- Total Calories indicator: "780 kcal" with dietary tags ("Vegetarian", "Spicy").

RIGHT COLUMN (60% Width - The 4-Step Configurator):
- Top Progress Navigation Bar showing 4 steps with glowing active states:
  Step 1: Base (Crust) ➔ Step 2: Sauce ➔ Step 3: Cheese ➔ Step 4: Toppings.

- STEP 1 CONTENT: "Choose Your Foundation (5 Options)"
  5 Selectable Radio Cards (2-column grid):
  1. Classic Hand-Tossed (+$4.00, Stock: 60 left)
  2. Thin Crust Crispy (+$4.50, Stock: 45 left)
  3. Rustic Sourdough (+$5.00, Stock: 35 left, Selected state with glowing orange border)
  4. Gluten-Free Cauliflower (+$5.50, Stock: 25 left)
  5. Cheesy Garlic Stuffed (+$6.00, Stock: 30 left)

- STEP 2 CONTENT: "Select Your Signature Sauce (5 Options)"
  5 Cards with color indicators & spicy chili icons:
  1. San Marzano Marinara (Mild, +$1.50)
  2. Fiery Arrabiata (Spicy 🌶️🌶️, +$1.80)
  3. Creamy Roasted Garlic Alfredo (Rich, +$2.20)
  4. Smoky Hickory BBQ (Tangy, +$2.00)
  5. Ligurian Basil Pesto (Herbal, +$2.50)

- STEP 3 CONTENT: "Artisanal Cheese (Single Select)"
  Fior di Latte Mozzarella, Sharp Aged Cheddar, Smoked Gouda, Fresh Ricotta Dollops, Vegan Cashew Cheese.

- STEP 4 CONTENT: "Garden Veggies (Multi-Select Toppings)"
  Toggle pill buttons with checkmarks:
  Sweet Bell Peppers, Caramelized Onions, Kalamata Black Olives, Pickled Jalapeños, Button Mushrooms, Sun-Dried Tomatoes.

BOTTOM TRAY (Sticky):
- Displays "Total: $17.50" on the left.
- "Add to Order & Proceed to Checkout" button on the right (vibrant Paprika gradient with arrow icon).
```

---

### 💳 PROMPT 3: Cart Drawer & Razorpay Test Payment Modal
```text
Design a checkout slide-over drawer and a centered Razorpay test modal overlay.

1. CART SLIDE-OVER DRAWER (Right-aligned, 450px width):
- Header: "Your Order (1 Custom Pizza, 1 Beverage)".
- Itemized card for the Custom Pizza showing all chosen base, sauce, cheese, and veggie ingredients.
- Invoice Summary Table:
  - Subtotal: $17.50
  - Taxes (8%): $1.40
  - Delivery Fee: $3.50
  - TOTAL DUE: $22.40 (Bold Gold)
- Delivery Information Section:
  - Street Address Input: "42 Tech Boulevard, Suite 100" (with location pin icon)
  - Phone Number Input: "+1 234 567 8900"
- Big Action Button: "Proceed to Payment (Razorpay Test Gateway)" with official blue Razorpay badge.

2. RAZORPAY TEST PAYMENT MODAL (Centered 480px glassmorphic card):
- Header: Blue banner with Razorpay logo + "Test Mode Active - No Real Money Charged".
- Merchant Info: "Crust & Craft • Order #CC-84920 • Amount: ₹1,850 ($22.40)".
- Simulation Buttons:
  - "Simulate Success (Instant Confirmation)" (Green button with checkmark).
  - "Simulate Card Payment (Test 4111...)".
  - "Simulate Failure (Test Error Handling)".
```

---

### ⏱️ PROMPT 4: Real-Time Live Order Status Tracker
```text
Design a live order status dashboard (1440x900) for active customers tracking their order.

1. STATUS HEADER:
- "Order #CC-91820" with a glowing neon cyan badge: "● Live WebSocket Synchronized".
- Estimated Delivery Time: "Arriving in 18 Minutes (12:35 PM)".

2. 4-STEP GLOWING PROGRESS TIMELINE (Horizontal):
- Step 1: "Order Received" (Green circle with checkmark, Completed 12:00 PM)
- Step 2: "In Kitchen (Wood-Fired Baking)" (Active Glowing Amber ring with pulsing flame animation, "Chef Marco is tossing your sourdough crust")
- Step 3: "Out for Delivery" (Pending gray circle with scooter icon)
- Step 4: "Delivered" (Pending gray circle with home door icon)

3. LIVE COURIER SIMULATION:
- A stylized dark-mode map illustration with an animated courier scooter moving along an amber route line toward a glowing destination pin.
- Courier card: "Driver: Liam K. (Scooter #84) • Contact Driver button".

4. ORDER SUMMARY ACCORDION:
- Collapsible tray displaying full custom pizza recipe, receipt number, and payment confirmation stamp ("Razorpay Verified • Transaction ID: pay_Nz84lskjdf91").
```

---

### 📊 PROMPT 5: Isolated Admin Operations Cockpit (Store Manager)
```text
Design an enterprise-grade, high-density dark admin operations cockpit (1440x1024).

1. TOP BAR:
- Title: "Crust & Craft — Kitchen Operations & Stock Control".
- Right: Admin Profile ("Natnael Tezazu • Operations Director") and a glowing warning bell ("Low Stock Alert: 2 Ingredients").

2. ROW 1 - METRIC KPI CARDS (4 Cards):
- Card 1: Today's Orders: "64" (+18% vs yesterday)
- Card 2: Active in Kitchen: "5" (Live baking queue)
- Card 3: Revenue: "$1,482.00"
- Card 4: Inventory Health: "92%" (2 items below 20-unit threshold)

3. ROW 2 - LIVE INVENTORY MANAGEMENT TABLE (The Oasis Mandate):
- High-density data table with search bar and category filter (All / Bases / Sauces / Cheeses / Veggies).
- Table Columns:
  - Ingredient Name
  - Category
  - Current Stock (units)
  - Alert Threshold (default: 20)
  - Health Status Pill (Safe: Green | Low Stock: Yellow | Depleted: Red)
  - Quick Replenish Actions
- Sample Rows to Display:
  - Thin Crust Crispy (Base) | Stock: 18 | Threshold: 20 | YELLOW PILL "Low Stock" | [+20 Restock button]
  - Rustic Sourdough (Base) | Stock: 34 | Threshold: 20 | GREEN PILL "Nominal" | [+20 Restock button]
  - San Marzano Marinara (Sauce) | Stock: 94 | Threshold: 20 | GREEN PILL "Nominal" | [+20 Restock button]
  - Fresh Ricotta (Cheese) | Stock: 8 | Threshold: 20 | RED PILL "Critical" | [+50 Restock button]
- Action Bar above table: "Trigger node-cron Audit Now" (allows admin to test background low-stock email alerts on demand).

4. ROW 3 - LIVE ORDER DISPATCH BOARD:
- Live streaming table of active orders with instant action buttons:
  - Order #CC-91820 ($22.40) | Items: Custom Sourdough Pizza | Action: "Move to In Kitchen (Baking)" (instantly triggers WebSocket push to customer).
  - Order #CC-91819 ($18.00) | Items: Truffle Funghi | Action: "Dispatch to Driver".
```

---

## 🚀 Next Step: Paste into Figma
1. Copy each of the 5 prompts into Figma.
2. Once your designs or code are generated in Figma, provide the exported UI code, and we will integrate it directly with our live Express/MongoDB/Socket.io backend!
