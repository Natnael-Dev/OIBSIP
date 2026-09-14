# Security, RBAC & Data Protection Specification

## Standard: Defense in Depth & Zero-Trust Access Boundaries
**Platform:** Crust & Craft (Level 3 Full-Stack MERN)  

---

## 1. Role-Based Access Control (RBAC) Architecture

Two distinct user roles govern system access:

```mermaid
graph LR
    subgraph Public_Scope [Public & Guest Scope]
        Route_Pizzas[/api/pizzas]
        Route_Inventory[/api/inventory]
        Route_Track[/api/orders/track/:num]
        Route_Auth[/api/auth/register, login, verify]
    end

    subgraph Customer_Scope [Customer Scope - JWT Protected]
        Route_Checkout[/api/orders/checkout]
        Route_VerifyPay[/api/orders/verify-payment]
        Route_MyOrders[/api/orders/my-orders]
        Route_Profile[/api/auth/me]
    end

    subgraph Admin_Scope [Admin Scope - RBAC Gated]
        Route_StockUpdate[/api/inventory/:id/stock]
        Route_Threshold[/api/inventory/:id/threshold]
        Route_AuditTrigger[/api/inventory/audit-trigger]
        Route_AllOrders[/api/orders/admin/all]
        Route_StatusUpdate[/api/orders/admin/:id/status]
    end

    Public_Scope -->|No Auth Required| Open[Public User]
    Customer_Scope -->|Requires Bearer JWT| Customer[Verified Customer]
    Admin_Scope -->|Requires Bearer JWT + role===admin| Admin[Store Operations Director]
```

### 1.1 RBAC Enforcement Invariant
Any request with a valid customer token attempting to call `/api/inventory/:id/stock` or `/api/orders/admin/*` is immediately intercepted by `requireAdmin` middleware and terminated with:
```json
{
  "success": false,
  "message": "Access denied: Administrative privileges required."
}
```
HTTP Status: `403 Forbidden`.

---

## 2. Anti-IDOR & Information Disclosure Prevention

### 2.1 Order History Scoping
When a customer queries `GET /api/orders/my-orders`, the backend binds the query strictly to the authenticated token:
```javascript
// orderController.js
const orders = await Order.find({ customer: req.user._id });
```
A customer cannot enumerate or read another customer's orders by altering query parameters.

### 2.2 Public Tracking Sanitization
When an order is tracked publicly via `GET /api/orders/track/:orderNumber`:
* The query does **NOT** expose:
  - Customer passwords, hashes, or payment card tokens.
  - Internal database IDs of third-party vendors.
* The query **ONLY** returns:
  - `orderNumber`, `orderStatus`, `statusHistory`, `items`, and estimated delivery ETA.

---

## 3. Cryptographic Invariants

| Security Function | Cryptographic Primitive | Implementation Detail |
| :--- | :--- | :--- |
| **Password Storage** | `bcrypt` (Blowfish-based cipher) | Salt rounds: 10 (`bcrypt.genSalt(10)`). Hashes are never stored in memory or exposed in query projections. |
| **Payment Verification** | HMAC SHA-256 | Computes `crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex')` to verify Razorpay signature. |
| **Email Verification Token** | CSPRNG (Crypto Secure Pseudo-Random) | 32-byte hex string (`crypto.randomBytes(32).toString('hex')`). |
| **Password Reset Token** | CSPRNG with 15-min TTL | 32-byte hex string invalidated immediately upon successful reset. |

---

## 4. HTTP Headers & Transport Hardening

1. **`helmet({ contentSecurityPolicy: false })`:** Enforces secure HTTP headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `X-XSS-Protection`).
2. **`cors({ origin: CLIENT_URL, credentials: true })`:** Prevents cross-origin malicious scripts from firing unauthorized state-changing operations.
3. **Input Sanitization:** Email normalization (`trim().toLowerCase()`), strictly validated MongoDB IDs using `mongoose.Types.ObjectId.isValid()`, and sanitized string fields preventing NoSQL query injection.
