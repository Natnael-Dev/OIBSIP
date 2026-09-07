# Anti-AI Slop & Visual Excellence Manifesto

## Standard: Production Integrity, Zero AI Boilerplate, & Tactile Delight
**Project:** Crust & Craft (Level 3 Oasis Infobyte Full-Stack)  
**Evaluator Audience:** Oasis Infobyte Technical Reviewers & Project Managers  

---

## 1. What is "AI Slop" and Why We Ban It Completely

AI slop refers to superficial, low-effort code and designs commonly produced by unguided language models:
* ❌ **Fake Interactivity:** Buttons that look clickable but do nothing, or only trigger an `alert('Button clicked')`.
* ❌ **Placeholder Hallucinations:** Unconnected forms that don't validate or send data anywhere.
* ❌ **Generic "Purple Gradient" Aesthetics:** Generic cookie-cutter templates with zero typography hierarchy, poor contrast, and uninspired layouts.
* ❌ **Dead Code & Unhandled Errors:** Empty catch blocks (`catch (e) {}`), silent failures, or unstyled default browser alerts.
* ❌ **Non-Functional Placeholders:** Hardcoded static values masquerading as dynamic databases.

---

## 2. The Crust & Craft Engineering Principles

### 2.1 Authentic Mechanical Reality
* **Every Button Works:** If there is a button, it triggers real state changes, optimistic UI updates, or verified API calls.
* **True Database Persistence:** Every pizza created, ingredient decremented, and status changed is permanently stored and retrievable from MongoDB.
* **Cryptographic Security:** Passwords are real salted `bcrypt` hashes. Payment signatures are real HMAC SHA-256 verifications.
* **Graceful Degradation:** When services run in test mode (like Razorpay test keys or local email), the app runs authentic simulation pipelines rather than crashing or faking.

### 2.2 Visual WOW Factor (DesignCode / ThreeUI Glassmorphism)
* **Color Palette & Contrast (WCAG AA):**
  - Background: Deep Obsidian & Warm Slate (`#0B0E14`, `#121824`).
  - Brand Accent: Artisanal Amber / Fiery Saffron (`#F59E0B`, `#EA580C`).
  - Forest Sage (Fresh Veggies / Safe Stock): `#10B981`.
  - Alert Crimson (Low Stock / Errors): `#EF4444`.
* **Tactile Pizza Canvas:**
  - In the 4-step custom builder, selecting a crust, sauce, cheese, or topping dynamically layers visual badges, updates a live isometric preview, and displays live calorie/pricing counters.
* **Micro-Interactions & Spring Physics:**
  - Interactive radio cards for base & sauce that scale subtly on hover (`hover:scale-[1.02] active:scale-[0.98]`).
  - Smooth animated transitions between steps (`Framer Motion` / CSS transitions).
  - Floating pill notification toasts with spring physics.
* **Modern Typography:**
  - Headings: Bold, character-rich display font (e.g. `Plus Jakarta Sans` or `Outfit`).
  - Body: Crisp, highly legible sans-serif (e.g. `Inter`).

---

## 3. Reviewer Checklist: What Will Impress the Oasis Infobyte PMs

1. **The Custom Pizza Builder:**
   - 4 clear visual steps (5 bases, 5 sauces, cheeses, multi-select vegetables).
   - Live cost calculator updating in real time.
2. **The Atomic Inventory Decrement:**
   - The moment an order is confirmed, the admin inventory numbers instantly drop.
   - Live demonstration in video will show: Stock before = 50 ➔ Order placed ➔ Stock after = 49.
3. **The Scheduled Low-Stock Automation:**
   - Demonstrating `node-cron` running in the terminal logs and dispatching an email notification via Nodemailer.
4. **The Live WebSocket Status Tracker:**
   - Opening User Screen and Admin Screen side-by-side in the video:
   - Admin clicks `"Advance to In Kitchen"` ➔ User's stepper turns orange and advances **instantly without page reload**.
5. **The Strict 2-Second Title Card:**
   - Clean, professional video intro showing Natnael Tezazu, Web Development & Designing, and Level 3 Task 1.
