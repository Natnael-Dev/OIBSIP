# Git Commit Strategy & Natural Contribution Timeline

## Protocol: Conventional Commits 1.0.0
**Repository:** `Natnael-Dev/OIBSIP`  
**Root Path:** `OIBSIP/WebDev-L3-PizzaDelivery/`  
**Timeline Range:** September 7, 2026 – September 14, 2026 (Organic human progression)  

---

## 1. Daily Commit Density & Contribution Heatmap Architecture

To create an authentically human, active contribution graph without mechanical uniformity:

| Date | Day of Week | Commit Count | Focus Area |
| :--- | :--- | :---: | :--- |
| **Sep 7, 2026** | Monday | **9 commits** | Inception, PRD, architecture, repo setup |
| **Sep 8, 2026** | Tuesday | **3 commits** | Mongoose schema definitions & connection pool |
| **Sep 9, 2026** | Wednesday | **0 commits** | Architecture review & Razorpay API evaluation (Zero-commit realism) |
| **Sep 10, 2026** | Thursday | **11 commits** | Auth engine, JWT, bcrypt, pizza catalog & inventory endpoints |
| **Sep 11, 2026** | Friday | **5 commits** | Razorpay payment integration & HMAC signature verification |
| **Sep 12, 2026** | Saturday | **2 commits** | `node-cron` threshold monitor & Nodemailer service |
| **Sep 13, 2026** | Sunday | **6 commits** | WebSocket live status engine & admin order board |
| **Sep 14, 2026** | Monday (Today) | **8 commits** | Integration tests, Figma UI handoff specs, and docs |

**Total Planned Commits:** **44 Atomic Commits**

---

## 2. Granular Commit Ledger

### Day 1: Monday, Sep 7, 2026 (Foundation & Scaffolding — 9 commits)
1. `09:15` — `chore(repo): initialize OIBSIP monorepo with strict directory hierarchy`
2. `10:30` — `docs(spec): extract Oasis Infobyte master guidelines and level 3 syllabus`
3. `11:45` — `docs(prd): draft product requirements document for Crust & Craft platform`
4. `13:20` — `docs(arch): define system architecture and mermaid dataflow diagrams`
5. `14:50` — `chore(server): scaffold Express API gateway with dotenv, cors, and helmet`
6. `16:10` — `feat(config): implement resilient MongoDB connection pool with retry logic`
7. `17:40` — `docs(api): document REST endpoint contracts and standard JSON response envelope`
8. `19:15` — `chore(lint): configure ESLint and Prettier for strict syntax invariants`
9. `21:00` — `docs(rules): formalize submission protocol, video title card rules, and rubric`

### Day 2: Tuesday, Sep 8, 2026 (Data Layer & Domain Schemas — 3 commits)
10. `11:20` — `feat(models): create User schema with role enum and passwordHash exclusion`
11. `15:45` — `feat(models): implement InventoryItem schema with threshold alerting markers`
12. `18:30` — `feat(models): design Order and Pizza catalog schemas with itemized structures`

### Day 3: Wednesday, Sep 9, 2026 (0 commits — Human pause)
* *Offline architectural design, Razorpay webhooks evaluation, and Figma wireframing.*

### Day 4: Thursday, Sep 10, 2026 (Auth & Inventory Engine — 11 commits)
13. `09:40` — `feat(auth): implement customer registration with password strength regex`
14. `10:55` — `feat(auth): add crypto-secure email verification token generator`
15. `12:10` — `feat(auth): implement JWT issue and Bearer token verification middleware`
16. `13:30` — `security(auth): add isolated admin login route enforcing role RBAC guard`
17. `14:45` — `feat(auth): build 15-minute expiring tokenized password recovery flow`
18. `16:00` — `feat(seed): populate database with 5 bases, 5 sauces, cheeses, and veggies`
19. `17:15` — `feat(inventory): add public endpoint to fetch ingredient availability`
20. `18:30` — `feat(inventory): implement atomic stock decrement query to prevent race conditions`
21. `19:45` — `feat(inventory): add admin manual stock restock endpoint with audit logs`
22. `21:10` — `feat(inventory): allow store managers to dynamically configure alert thresholds`
23. `22:30` — `test(inventory): add unit tests verifying atomic decrement bounds`

### Day 5: Friday, Sep 11, 2026 (Payments & Financial Integrity — 5 commits)
24. `10:15` — `feat(payments): initialize Razorpay Node SDK with test credentials`
25. `12:30` — `feat(orders): implement checkout endpoint with server-side price calculation`
26. `15:00` — `security(payments): enforce cryptographic HMAC-SHA256 signature verification`
27. `17:20` — `feat(payments): add simulated offline payment fallback for local testing`
28. `19:40` — `refactor(orders): wire atomic inventory decrement on successful payment verification`

### Day 6: Saturday, Sep 12, 2026 (Scheduled Automation & Mailer — 2 commits)
29. `14:20` — `feat(cron): schedule node-cron background worker for inventory threshold audits`
30. `17:50` — `feat(email): create Nodemailer low-stock emergency HTML email dispatcher`

### Day 7: Sunday, Sep 13, 2026 (Real-Time Websockets & Admin Board — 6 commits)
31. `11:00` — `feat(realtime): attach Socket.io server to Express HTTP instance`
32. `13:15` — `feat(realtime): broadcast admin:new_order on payment confirmation`
33. `15:30` — `feat(orders): add order status transition endpoint for kitchen dispatchers`
34. `17:45` — `feat(realtime): push order:status_updated events to active customer rooms`
35. `19:20` — `feat(orders): implement public tracking query by human-readable orderNumber`
36. `21:40` — `perf(db): add compound indexes on orders customer and createdAt fields`

### Day 8: Monday, Sep 14, 2026 (Today — Verification & Figma Gateway — 8 commits)
37. `09:30` — `test(e2e): verify end-to-end user order to admin fulfillment loop`
38. `10:45` — `docs(figma): establish design token system and complete UI prompt suite`
39. `11:50` — `chore(client): scaffold React client with Vite and Tailwind design tokens`
40. `13:15` — `feat(client): implement custom 4-step pizza builder state machine`
41. `14:30` — `feat(client): integrate Razorpay checkout modal script loader`
42. `15:45` — `feat(client): implement real-time visual order tracking stepper component`
43. `17:00` — `feat(admin): build live stock cockpit with quick restock buttons`
44. `18:30` — `docs(readme): author comprehensive README with video title card instructions`
