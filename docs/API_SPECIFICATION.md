# API Specification & Endpoint Contracts

## Project: Crust & Craft — Pizza Delivery Full-Stack Engine
**Base URL:** `http://localhost:5000/api`  
**Protocol:** REST (JSON) + WebSockets (`ws://localhost:5000`)  
**Standard Response Envelope:**
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message",
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## 1. Authentication & Security Routes (`/api/auth`)

### 1.1 Customer Registration
* **Endpoint:** `POST /api/auth/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "Password123!",
    "phone": "+1234567890"
  }
  ```
* **Validation Rules:**
  - `email`: Valid email format, unique in DB.
  - `password`: Min 8 chars, at least 1 digit, 1 uppercase letter.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify your email via the link sent.",
    "data": {
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "alex@example.com",
      "isVerified": false
    }
  }
  ```

### 1.2 Email Verification
* **Endpoint:** `GET /api/auth/verify-email?token=:token`
* **Access:** Public
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email verified successfully. You may now log in."
  }
  ```

### 1.3 Customer Login
* **Endpoint:** `POST /api/auth/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "Password123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
      "user": {
        "id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Alex Mercer",
        "email": "alex@example.com",
        "role": "customer"
      }
    }
  }
  ```

### 1.4 Admin Login (Isolated Boundary)
* **Endpoint:** `POST /api/auth/admin-login`
* **Access:** Restricted (Requires Admin Role)
* **Request Body:**
  ```json
  {
    "email": "admin@crustcraft.com",
    "password": "SuperAdminSecret2026!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
      "admin": {
        "id": "64f1a2b3c4d5e6f7a8b9c0a0",
        "name": "Store Operations Director",
        "email": "admin@crustcraft.com",
        "role": "admin"
      }
    }
  }
  ```

### 1.5 Forgot Password & Password Reset
* **`POST /api/auth/forgot-password`**  
  - Body: `{ "email": "alex@example.com" }`
  - Generates a crypto-random hex token with 15-minute expiry; sends reset URL via Nodemailer.
* **`POST /api/auth/reset-password`**  
  - Body: `{ "token": "a1b2c3d4e5f6...", "newPassword": "NewPassword2026!" }`
  - Validates token expiry, rehashes password via `bcrypt`, and invalidates the reset token.

---

## 2. Inventory & Stock Control Routes (`/api/inventory`)

### 2.1 Get All Ingredients (Public / Customer Builder)
* **Endpoint:** `GET /api/inventory`
* **Access:** Public
* **Query Params:** `?category=base|sauce|cheese|veggie` (optional filter)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c010",
        "name": "Rustic Sourdough",
        "category": "base",
        "unitPrice": 4.50,
        "isAvailable": true,
        "stockQuantity": 84,
        "alertThreshold": 20
      },
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c011",
        "name": "San Marzano Marinara",
        "category": "sauce",
        "unitPrice": 2.00,
        "isAvailable": true,
        "stockQuantity": 95,
        "alertThreshold": 20
      }
    ]
  }
  ```

### 2.2 Manual Stock Update (Admin Only)
* **Endpoint:** `PATCH /api/inventory/:id/stock`
* **Access:** Protected (`Bearer JWT` + `role === 'admin'`)
* **Request Body:**
  ```json
  {
    "operation": "add",
    "quantity": 50
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Stock updated successfully.",
    "data": {
      "name": "Rustic Sourdough",
      "previousStock": 84,
      "newStock": 134
    }
  }
  ```

### 2.3 Update Alert Threshold (Admin Only)
* **Endpoint:** `PATCH /api/inventory/:id/threshold`
* **Access:** Protected (`Bearer JWT` + `role === 'admin'`)
* **Request Body:** `{ "alertThreshold": 25 }`

---

## 3. Preset Pizza Catalog Routes (`/api/pizzas`)

* **`GET /api/pizzas`**: Lists curated signature pizzas (e.g., Margherita Royale, Truffle Funghi, Spicy Diavola) with calculated base prices, imagery, descriptions, and dietary tags.
* **`POST /api/pizzas`** *(Admin Only)*: Add a new signature variety.

---

## 4. Orders & Payment Processing (`/api/orders`)

### 4.1 Create Order & Initialize Razorpay
* **Endpoint:** `POST /api/orders/checkout`
* **Access:** Protected (`Bearer JWT`)
* **Request Body:**
  ```json
  {
    "items": [
      {
        "itemType": "custom",
        "base": "Rustic Sourdough",
        "sauce": "Fiery Arrabiata",
        "cheese": "Fior di Latte Mozzarella",
        "veggies": ["Slow-Caramelized Onions", "Kalamata Black Olives"],
        "quantity": 1,
        "unitPrice": 16.50
      }
    ],
    "deliveryAddress": "42 High Street, Tech Quarter",
    "customerPhone": "+1234567890"
  }
  ```
* **Logic:**
  1. Validates inventory availability for all chosen ingredients.
  2. Calculates subtotal, tax (8%), and delivery fee.
  3. Creates Razorpay Order via `razorpay.orders.create({ amount: total * 100, currency: "INR" })`.
  4. Saves order in DB with `payment.status = 'pending'`.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "64f1a2b3c4d5e6f7a8b9c999",
      "orderNumber": "CC-91823",
      "totalAmount": 19.32,
      "currency": "INR",
      "razorpayOrderId": "order_Nz83kd91Lskd",
      "razorpayKeyId": "rzp_test_YourKeyHere"
    }
  }
  ```

### 4.2 Verify Razorpay Payment & Confirm Order
* **Endpoint:** `POST /api/orders/verify-payment`
* **Access:** Protected (`Bearer JWT`)
* **Request Body:**
  ```json
  {
    "orderId": "64f1a2b3c4d5e6f7a8b9c999",
    "razorpayOrderId": "order_Nz83kd91Lskd",
    "razorpayPaymentId": "pay_Nz84lskjdf91",
    "razorpaySignature": "3fa9b18c..."
  }
  ```
* **Logic:**
  1. Computes HMAC SHA-256 hash using `RAZORPAY_KEY_SECRET`.
  2. Confirms signature match (or executes test-mode simulation bypass if in offline test environment).
  3. Updates order status to `received` and `payment.status` to `paid`.
  4. **Executes atomic decrement query** on all involved inventory quantities.
  5. Broadcasts `admin:new_order` event via Socket.io.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment verified. Order is now confirmed and sent to kitchen.",
    "data": {
      "orderNumber": "CC-91823",
      "orderStatus": "received"
    }
  }
  ```

### 4.3 Get Order Live Tracking Details
* **Endpoint:** `GET /api/orders/:orderNumber/track`
* **Access:** Public or Protected
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "orderNumber": "CC-91823",
      "orderStatus": "in_kitchen",
      "statusHistory": [
        { "status": "received", "timestamp": "2026-09-14T12:00:00Z" },
        { "status": "in_kitchen", "timestamp": "2026-09-14T12:08:00Z" }
      ],
      "estimatedDeliveryTime": "25 mins"
    }
  }
  ```

### 4.4 Admin: Update Order Status
* **Endpoint:** `PATCH /api/orders/admin/:orderId/status`
* **Access:** Protected (`Bearer JWT` + `role === 'admin'`)
* **Request Body:**
  ```json
  {
    "newStatus": "in_kitchen"
  }
  ```
* **Broadcasts:** Socket.io event `order:status_updated` to customer room.

---

## 5. WebSocket Event Contracts (`Socket.io`)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_order_room` | Client ➔ Server | `{ "orderNumber": "CC-91823" }` | Customer joins private room for live tracking |
| `order:status_updated` | Server ➔ Client | `{ "orderNumber": "CC-91823", "status": "in_kitchen", "updatedAt": "..." }` | Pushes step progression to customer |
| `admin:new_order` | Server ➔ Admin | `{ "orderId": "...", "orderNumber": "...", "total": 19.32, "items": [...] }` | Real-time alert on Admin dashboard |
| `inventory:alert` | Server ➔ Admin | `{ "ingredient": "Thin Crust", "remaining": 18, "threshold": 20 }` | Real-time low-stock popup banner |
