# FIGMA ITERATION PROMPT — Crust & Craft v2
### This is a fix pass on the existing file, not a rebuild. Apply every item below.

---

## 1. TYPOGRAPHY — REPLACE ENTIRELY

The current font reads as generic AI-default (likely an Inter/Poppins/Manrope-family pick). Replace it site-wide with this pairing:

- **Display/headline:** **Instrument Serif** (or **Fraunces**, 600–700 weight, optical size "opsz" set to large). Used only for hero headlines, section titles, and the oversized graphic numerals. Never used below 28px.
- **Body/UI:** **General Sans** (or **Switzer** as a second choice). Used for nav, body copy, buttons, prices, labels. Weight 400 for body, 500–600 for UI labels/buttons.

**Explicitly do not use:** Inter, Poppins, Montserrat, Roboto, Manrope, Lato, Open Sans, or any default system font stack. These are the fonts every AI-generated site defaults to — if the font picker suggests one of these, reject it and pick from the list above instead (all are free, available via Google Fonts/Fontshare).

Apply real type hierarchy: hero headline ~72–96px desktop / ~40px mobile, section titles ~40–48px, body 16–18px, labels 12–13px with slight letter-spacing (0.02em). Tighten line-height on the serif headline to ~1.05 — the current spacing likely reads loose and default.

---

## 2. SCROLL ANIMATION — FIX THE JANK

The stuck/janky scroll is almost certainly caused by one of these — fix all:

- **Stop animating layout properties on scroll.** Any scroll-linked transform must only touch `transform` and `opacity` — never `top`, `margin`, `height`, or `width`. If the hero parallax or any section is currently animating a layout property, convert it to `transform: translateY()` / `scale()`.
- **Use spring-smoothed scroll progress, not raw scroll position.** Wrap scroll-driven values through a spring (stiffness ~100, damping ~30) so the motion trails the scroll smoothly instead of snapping frame-to-frame.
- **Don't scroll-link every section.** Only the hero parallax and maybe one other signature moment should be continuously tied to scroll position. Everything else (card reveals, section fade-ins) should be a one-time trigger on viewport-enter (IntersectionObserver / "whileInView"), not a continuous scroll listener — continuous listeners on many elements is the most common cause of scroll jank.
- **Check for competing scroll-snap or overflow rules.** If any container has `scroll-snap-type` or `overflow: hidden` fighting the main page scroll, remove it unless it's an intentional full-screen-per-section design (in which case it needs to be deliberate and smooth, not accidental).
- **Reduce simultaneous video decode load during scroll.** If multiple background videos are actively playing while the user scrolls past them, pause any video whose section isn't in viewport — decode load is a common cause of visible stutter.

---

## 3. COLOR & CONTRAST — FULL AUDIT AND FIX

This is the most serious issue. Establish and apply this rule everywhere, no exceptions:

> **Text is never placed directly on a photo, video, or busy background without a scrim.** Every block of text sitting over media gets a gradient or solid scrim behind it sized to the text's bounding area, not just the whole image uniformly — a full-image 20% dark overlay is not enough if the image itself has light/bright zones behind the text.

Specific fixes required:

- **"Crafted for Those Who Demand the Extraordinary" (hero headline):** currently same color as the pizza image behind it. Add a dedicated scrim — a radial or linear gradient (obsidian `#080B11` at 60–80% opacity) positioned specifically behind the text block, not the whole hero. Alternatively, set the headline color to pure white (`#FFFFFF` or near-white `#F8FAFC`) with a subtle drop shadow (`0 2px 24px rgba(0,0,0,0.6)`) so it separates from any background value it sits on.
- **"Single Origin Toppings, Delivered in 30 Minutes" list:** currently invisible — almost certainly the text color is too close to the card/background color. Set body text on dark backgrounds to `#CBD5E1` (slate-200) minimum, headings to `#F8FAFC`. Never use a color darker than `#94A3B8` for body text on the obsidian base.
- **"Next One Is On Us" text:** same fix — check this isn't set to a dark color on a dark background by mistake (likely a leftover default text color that wasn' updated when the section background changed).
- **Run a full contrast pass:** every text element on every screen must hit at least WCAG AA (4.5:1 for body text, 3:1 for large headline text) against whatever sits behind it, including video frames at their brightest point, not just their average color.

**Color system refinement:** keep the near-monochrome base, but make the accent usage more deliberate — amber (`#F59E0B`) for primary CTAs and heat/fire moments only, basil (`#10B981`) for fresh/veg tags only, chili (`#EF4444`) for spice-level tags only. Every other UI element (nav, borders, secondary text) stays in the slate/steel grayscale range. Right now if color feels "bad," it's likely because accent colors are being used decoratively instead of meaningfully — tighten that.

---

## 4. NAVIGATION — REBUILD

Replace the current side nav (4 items, vertical) entirely with a proper top navigation:

- **Desktop:** horizontal top nav, logo/wordmark left, primary links (Home, Menu, Build, Track) center or right, cart icon + primary CTA button far right. Sticky on scroll with a blur/glass background (`#080B11` at 70% opacity, backdrop-blur) that activates once the user scrolls past the hero.
- **Mobile (<768px):** collapse to a hamburger icon (top right). Tapping opens a full-screen or slide-in menu — dark glass background, large serif nav links stacked vertically, staggered fade-up entrance (60ms stagger per item), close button top right. Include the cart/CTA in this mobile menu too.
- Add a subtle underline or dot indicator for the active page in the nav — right now with only 4 flat links there's no sense of "where am I."

---

## 5. MENU SECTION — ADD DESIGN, CONTENT, AND DEFAULT VISIBILITY

Current state (blank until hover, no animation, too basic) reads as unfinished. Fix:

- **Posters must be visible by default — hover is an enhancement, not a reveal.** The static food photo should be fully visible and styled (rounded frame, subtle border, shadow) the moment the page loads. On hover, cross-fade in the video loop *on top of* the already-visible poster. Nothing on this page should be blank or hidden pre-interaction.
- **Add a slow idle "breathing" motion to the static posters** — a very subtle continuous scale (1.0 → 1.03 → 1.0 over ~15–20s, ease-in-out) so the grid doesn't feel static even before anyone hovers.
- **Expand beyond 4 cards.** Add a horizontal scrollable/carousel section beneath the main 4-card grid for a wider menu (sides, drinks, desserts, or additional pizza variants) — gives the page more content and a reason to have a second layer of interaction (drag-scroll or arrow-nav carousel).
- **Add category filter tabs** above the grid (e.g. "Signature / Vegetarian / Spicy / New") with an animated underline that slides between tabs on selection.
- **Give the section real editorial structure:** a section eyebrow label, a large serif section title, and a short descriptive line — right now if it's "very basic" it's likely missing this kind of framing entirely and going straight to the card grid.

---

## 6. BUILD PAGE — MAKE THE PREVIEW ACTUALLY REACT

The blank circle is the single biggest UX gap in the file. The live preview must visually update at every step, not just once at the end:

- **On Step 1 (crust selection):** the moment the user clicks "Hand Tossed" (or any crust), the preview circle immediately renders that crust layer — a flat circular base shape in the appropriate tone (pale gold for hand-tossed, darker toasted tone for sourdough, etc.). This must happen live, in the canvas, not just get logged in a summary panel.
- **On Step 2 (sauce):** a sauce layer renders on top of the crust — a colored ring/fill matching the sauce (red for marinara, white/cream for alfredo, green for pesto, etc.) at ~85% of the crust's radius, so the crust edge still shows as a "crust ring."
- **On Step 3 (cheese):** a cheese layer renders on top of the sauce — textured/speckled fill in a cheese-appropriate tone (white for mozzarella, deeper yellow for cheddar).
- **On Step 4 (toppings, multi-select):** each selected topping renders as small repeated icon/shape elements scattered across the pizza face in a natural, non-grid pattern (use a fixed pseudo-random scatter pattern per topping type, not perfect symmetry — real pizzas don't have toppings in a grid).
- **Every layer add/remove animates in/out** (scale+fade, ~400ms spring) rather than popping instantly.
- **Add a small live label** near the preview ("Hand-Tossed · Marinara · Mozzarella · Mushrooms, Peppers") that updates as selections change, reinforcing what the visual is showing.
- The end goal: by the time a customer finishes Step 4, the circle should look like a genuinely custom, recognizable pizza — not a placeholder that only resolves at checkout.

---

## 7. TRACK PAGE — KEEP AS IS FOR NOW

No major changes requested here. Minor polish only: make sure the ember background and oven-flame icon follow the same contrast rules from Section 3 above.

---

## 8. ADD: ADMIN OPERATIONS COCKPIT (`/admin`)

This is a required fifth screen, not optional (per the project spec — isolated admin persona, real-time inventory, dispatch queue). Design it now as part of this iteration:

- **Admin login (`/admin/login`):** separate, minimal screen — no ember/video motion at all, just the obsidian base, glass card, logo, and a clean form. This is a security-adjacent screen; treat it as calm and trustworthy, not cinematic.
- **Cockpit dashboard:**
  - Top bar: title, live-sync status badge (pulsing glow, 2s loop, per the original spec), admin account menu.
  - **Inventory table:** 4 categories (bases, sauces, cheeses, vegetables), each row showing item name, current stock, a low-stock indicator (color-coded: green/amber/red by threshold), and manual restock buttons (`+20`, `+50`). Row background does a 300ms highlight-flash on any live update, then fades back.
  - **Order dispatch queue:** a list/kanban of incoming orders with current status (Received / In Kitchen / Out for Delivery / Delivered) and a manual status-advance control per order.
  - **Low-stock alert log:** a small panel showing recent automated alert triggers (ties to the Nodemailer/cron requirement in the PRD) — even if just a static list in this design pass.
- Keep this screen the most restrained in the whole system: dense, data-first typography (the General Sans body face at smaller sizes, tabular numerals for stock counts), minimal motion, no large hero imagery. This screen is a tool, not a showcase — that contrast with the rest of the site is intentional and correct.

---

## 9. PRIORITY ORDER FOR THIS PASS

If Figma needs to sequence the work, do it in this order — each fixes a compounding problem:

1. Font replacement (affects every screen)
2. Color/contrast audit (affects every screen, fixes the invisible-text bugs)
3. Navigation rebuild (affects every screen)
4. Scroll animation fix (Home page primarily)
5. Menu section redesign
6. Build page live-preview logic
7. Admin cockpit (new)