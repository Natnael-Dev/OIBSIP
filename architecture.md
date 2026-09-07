# System Architecture & Technical Specification

## Project: Crust & Craft (Level 3 Full-Stack MERN Architecture)
**Intern:** Natnael Tezazu  
**Domain:** Web Development & Designing — Oasis Infobyte (SIP)  

---

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph Client Layer [Frontend Client - React]
        UI_User[Customer UI: Builder, Menu, Checkout, Live Tracker]
        UI_Admin[Admin UI: Inventory Cockpit, Order Board, Restock Panel]
        WS_Client[WebSocket / Real-time Listener]
        RP_Modal[Razorpay Checkout Test Modal]
    end

    subgraph Gateway_API [Node.js & Express API Gateway]
        MW_Auth[JWT & Role Authorization Guard]
        Router_Auth[/api/auth]
        Router_Pizza[/api/pizzas]
        Router_Inventory[/api/inventory]
        Router_Order[/api/orders]
        WS_Server[Socket.io / Real-Time Event Hub]
    end

    subgraph Automation_Engine [Background Automation & Services]
        Cron[node-cron Scheduled Worker]
        Mailer[Nodemailer Email Dispatcher]
    end

    subgraph Data_Layer [MongoDB Persistence]
        DB_Users[(Users & Admins)]
        DB_Inventory[(Inventory Items)]
        DB_Orders[(Orders & State History)]
    end

    subgraph External_Services [Third-Party Integrations]
        Razorpay_API[Razorpay Test Gateway API]
        SMTP_Relay[SMTP / Ethereal Email Mailbox]
    end

    UI_User -->|HTTP Requests / Bearer JWT| Gateway_API
    UI_Admin -->|HTTP Requests / Admin JWT| Gateway_API
    UI_User <-->|Bidirectional Status Updates| WS_Server
    UI_Admin <-->|Real-Time Order & Inventory Sync| WS_Server
    UI_User -->|Launches Modal| RP_Modal
    RP_Modal -->|Card / UPI Payment Simulation| Razorpay_API

    Router_Auth --> DB_Users
    Router_Pizza --> DB_Inventory
    Router_Inventory --> DB_Inventory
    Router_Order --> DB_Orders
    Router_Order -->|Atomic Decrement| DB_Inventory

    Cron -->|Audits Threshold <= 20 Units| DB_Inventory
    Cron -->|Triggers Alert| Mailer
    Mailer -->|Sends HTML Email| SMTP_Relay
```

---

## 2. Technology Stack & Invariants

* **Frontend:** React 18+ (Vite SPA or Next.js App Router), Tailwind CSS / Vanilla Design Tokens, Lucide Icons, Socket.io-Client, Razorpay Checkout SDK script.
* **Backend:** Node.js (v20+), Express.js framework, CORS, Helmet, dotenv.
* **Real-time Engine:** Socket.io (with automated fallback to polling).
* **Database:** MongoDB via Mongoose ORM.
* **Payment Processing:** Official Razorpay Node.js SDK (`razorpay`), test keys `rzp_test_...`.
* **Scheduler:** `node-cron` running background inventory threshold monitors.
* **Email System:** `nodemailer` with dynamic HTML template engine and Ethereal test inbox previews.
* **Password Hashing:** `bcryptjs` with salt factor 10.
* **Authentication:** JSON Web Tokens (`jsonwebtoken`) with `userId`, `email`, and `role`.

---

## 3. Database Schema Models (Mongoose)

### 3.1 `User` Schema (`models/User.js`)
```typescript
interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}
```

### 3.2 `InventoryItem` Schema (`models/InventoryItem.js`)
Stores all bases, sauces, cheeses, and vegetables for both pizza building and stock alerts.
```typescript
interface IInventoryItem {
  name: string;
  category: 'base' | 'sauce' | 'cheese' | 'veggie';
  stockQuantity: number;        // e.g. 50
  alertThreshold: number;       // default: 20
  unitPrice: number;            // for custom pizza price calculation
  isAvailable: boolean;         // false if stockQuantity <= 0
  lastAlertSentAt?: Date;       // prevent spamming admin every minute
}
```

### 3.3 `Order` Schema (`models/Order.js`)
```typescript
interface IOrderItem {
  itemType: 'preset' | 'custom';
  name: string;
  base: string;                 // e.g. 'Rustic Sourdough'
  sauce: string;                // e.g. 'Fiery Arrabiata'
  cheese: string;               // e.g. 'Fior di Latte Mozzarella'
  veggies: string[];            // e.g. ['Sweet Bell Peppers', 'Black Olives']
  quantity: number;
  unitPrice: number;
}

interface IOrder {
  orderNumber: string;          // e.g. 'CC-84920'
  customer: ObjectId;           // ref: 'User'
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  payment: {
    gateway: 'razorpay';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: 'pending' | 'paid' | 'failed';
    paidAt?: Date;
  };
  orderStatus: 'received' | 'in_kitchen' | 'sent_to_delivery' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
  createdAt: Date;
}
```

---

## 4. Business Logic & Invariants

### 4.1 Atomic Inventory Decrement
When an order's payment is verified (`POST /api/orders/verify-payment`), the backend must execute an atomic bulk update to prevent race conditions:
```javascript
// Atomically decrement stock
await Promise.all([
  InventoryItem.updateOne({ name: base, category: 'base' }, { $inc: { stockQuantity: -1 * qty } }),
  InventoryItem.updateOne({ name: sauce, category: 'sauce' }, { $inc: { stockQuantity: -1 * qty } }),
  InventoryItem.updateOne({ name: cheese, category: 'cheese' }, { $inc: { stockQuantity: -1 * qty } }),
  ...veggies.map(v => 
    InventoryItem.updateOne({ name: v, category: 'veggie' }, { $inc: { stockQuantity: -1 * qty } })
  )
]);
```

### 4.2 Automated Low-Stock Alert Engine (`node-cron`)
* A cron worker executes on schedule: `*/10 * * * *` (every 10 minutes) and on-demand after an order.
* It queries:
  ```javascript
  const lowStockItems = await InventoryItem.find({
    $expr: { $lte: ["$stockQuantity", "$alertThreshold"] }
  });
  ```
* If items are detected and no alert was sent in the last 6 hours:
  - Generates a styled HTML tabular report showing the depleted items.
  - Sends to Admin email via `nodemailer`.
  - Stamps `lastAlertSentAt = new Date()`.

### 4.3 Real-Time Order Updates via WebSockets
* When a customer places an order:
  - Server emits: `admin:new_order` -> Admin dashboard receives order sound + new card.
* When an admin updates order status (`received` ➔ `in_kitchen` ➔ `sent_to_delivery`):
  - Server emits: `order:status_updated` with `{ orderId, newStatus, timestamp }`.
  - Customer UI catches the event and advances the visual tracking stepper in real time.

---

## 5. API Endpoints Specification

### 5.1 Authentication (`/api/auth`)
* `POST /api/auth/register` — Registers user, generates verification token, sends email.
* `POST /api/auth/verify-email` — Confirms email verification token.
* `POST /api/auth/login` — Issues customer JWT.
* `POST /api/auth/admin-login` — Issues admin JWT (validates `role === 'admin'`).
* `POST /api/auth/forgot-password` — Sends password reset token.
* `POST /api/auth/reset-password` — Validates reset token and sets new password.

### 5.2 Inventory & Menu (`/api/inventory` & `/api/pizzas`)
* `GET /api/inventory` — Returns list of all ingredients, prices, and stock status.
* `PUT /api/inventory/:id/stock` *(Admin)* — Manually adjust stock quantity or trigger restock.
* `PUT /api/inventory/:id/threshold` *(Admin)* — Update alert threshold.
* `GET /api/pizzas` — Returns pre-configured pizza catalog.

### 5.3 Orders & Payments (`/api/orders`)
* `POST /api/orders/create` — Validates stock availability, creates order with `paymentStatus: 'pending'`, calls Razorpay API to generate `razorpayOrderId`.
* `POST /api/orders/verify` — Validates Razorpay HMAC SHA-256 signature, marks order `PAID`, triggers atomic inventory decrement, broadcasts `admin:new_order`.
* `GET /api/orders/my-orders` *(User)* — Lists logged-in user's order history.
* `GET /api/orders/:id/track` — Real-time tracking payload for a specific order.
* `GET /api/orders/admin/all` *(Admin)* — Fetches all orders with status filtering.
* `PUT /api/orders/admin/:id/status` *(Admin)* — Updates order status and broadcasts WebSocket event.

---

## 6. Security & Error Handling Guarantees

1. **Password Security:** Salted `bcrypt` hashing with salt rounds >= 10. Passwords never returned in query payloads (`select('-passwordHash')`).
2. **Signature Verification:** Razorpay webhook/client payment signature verified cryptographically:
   ```javascript
   const generatedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(razorpayOrderId + '|' + razorpayPaymentId)
     .digest('hex');
   ```
3. **Role Guards:** Route middleware prevents customer tokens from performing admin inventory adjustments or status overrides.
