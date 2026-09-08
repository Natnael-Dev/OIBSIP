# Data Dictionary & Schema Specification

## Project: Crust & Craft — MongoDB Data Models
**Database Engine:** MongoDB (via Mongoose 8+)  
**Collation:** UTF-8 case-insensitive on unique strings (e.g., email)  

---

## 1. Collection: `users`

Represents both end-consumers (customers) and store management staff (admins).

| Field Name | BSON Type | Nullable | Default | Constraints & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `_id` | ObjectId | No | Auto | Primary Key | Unique document identifier |
| `name` | String | No | — | Trimmed, 2-100 chars | Customer's full display name |
| `email` | String | No | — | Unique Index, Lowercase | Primary contact & authentication login key |
| `passwordHash` | String | No | — | Selected: `false` by default | Salted `bcrypt` hash (rounds: 10) |
| `phone` | String | Yes | `null` | Trimmed, E.164 or local | Contact number for order dispatch alerts |
| `role` | String | No | `'customer'` | Enum: `['customer', 'admin']` | Access privilege scope boundary |
| `isVerified` | Boolean | No | `false` | Indexed | Email verification status flag |
| `verificationToken` | String | Yes | `null` | Index (sparse) | Crypto hex token sent in activation email |
| `resetPasswordToken`| String | Yes | `null` | Index (sparse) | Crypto token for password recovery |
| `resetPasswordExpires` | Date | Yes | `null` | TTL check in logic | Expiration timestamp (15 min after request) |
| `createdAt` | Date | No | `Date.now` | Indexed | Timestamp of account registration |
| `updatedAt` | Date | No | `Date.now` | Managed by Mongoose | Timestamp of last modification |

---

## 2. Collection: `inventory_items`

Stores every physical component of the pizza catalog. Drives the 4-step custom builder and automated stock threshold alerts.

| Field Name | BSON Type | Nullable | Default | Constraints & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `_id` | ObjectId | No | Auto | Primary Key | Unique ingredient identifier |
| `name` | String | No | — | Unique Index, Trimmed | Ingredient name (e.g., "Rustic Sourdough") |
| `category` | String | No | — | Enum: `['base', 'sauce', 'cheese', 'veggie']`, Index | Structural category in pizza composition |
| `unitPrice` | Number | No | `0.00` | Min: 0, 2 decimal places | Additional cost added to base pizza price |
| `stockQuantity` | Number | No | `100` | Min: 0, Integer | Available physical units in storage |
| `alertThreshold` | Number | No | `20` | Min: 1, Integer | Trigger point for automated low-stock email |
| `unitOfMeasure` | String | No | `'units'` | e.g., "crusts", "ladles", "grams" | Physical metric representation |
| `isAvailable` | Boolean | No | `true` | Indexed | Auto-set to `false` if `stockQuantity <= 0` |
| `lastAlertSentAt` | Date | Yes | `null` | Timestamp | Rate-limiting tracker for `node-cron` notifications |
| `createdAt` | Date | No | `Date.now` | Managed by Mongoose | Creation timestamp |

### 2.1 Seed Baseline Ingredients (Oasis Infobyte Requirements)
* **Bases (Exactly 5):**
  1. *Classic Hand-Tossed* (Stock: 60, Base Price: $4.00)
  2. *Thin Crust Crispy* (Stock: 45, Base Price: $4.50)
  3. *Rustic Sourdough* (Stock: 35, Base Price: $5.00)
  4. *Gluten-Free Cauliflower Crust* (Stock: 25, Base Price: $5.50)
  5. *Cheesy Garlic Stuffed Crust* (Stock: 30, Base Price: $6.00)
* **Sauces (Exactly 5):**
  1. *San Marzano Marinara* (Stock: 100, Price: $1.50)
  2. *Fiery Arrabiata* (Stock: 80, Price: $1.80)
  3. *Creamy Roasted Garlic Alfredo* (Stock: 50, Price: $2.20)
  4. *Smoky Hickory BBQ* (Stock: 70, Price: $2.00)
  5. *Ligurian Basil Pesto* (Stock: 40, Price: $2.50)
* **Cheeses:**
  1. *Fior di Latte Mozzarella* (Stock: 120, Price: $2.50)
  2. *Sharp Aged Cheddar* (Stock: 60, Price: $2.80)
  3. *Smoked Gouda* (Stock: 45, Price: $3.00)
  4. *Fresh Ricotta Dollops* (Stock: 30, Price: $3.20)
  5. *Artisanal Vegan Cashew Cheese* (Stock: 25, Price: $3.50)
* **Vegetables:**
  1. *Sweet Bell Peppers* (Stock: 150, Price: $1.00)
  2. *Slow-Caramelized Onions* (Stock: 90, Price: $1.20)
  3. *Kalamata Black Olives* (Stock: 80, Price: $1.50)
  4. *Pickled Jalapeños* (Stock: 110, Price: $1.00)
  5. *Button Mushrooms* (Stock: 75, Price: $1.50)
  6. *Sun-Dried Tomatoes* (Stock: 60, Price: $1.80)

---

## 3. Collection: `pizzas` (Signature Catalog)

Curated pre-built artisanal recipes available directly on the homepage.

| Field Name | BSON Type | Nullable | Constraints & Index | Description |
| :--- | :--- | :---: | :--- | :--- |
| `name` | String | No | Unique, Trimmed | Signature pizza title (e.g. "Truffle Bianca") |
| `slug` | String | No | Unique Index | URL-friendly identifier |
| `description` | String | No | Max 500 chars | Appetizing culinary description |
| `basePrice` | Number | No | Min: 0 | Starting menu price |
| `defaultBase` | String | No | Reference to Base | Default crust choice |
| `defaultSauce` | String | No | Reference to Sauce | Default sauce choice |
| `defaultCheese` | String | No | Reference to Cheese | Default cheese |
| `defaultVeggies` | Array of String | No | List of Veggies | Included toppings |
| `imageUrl` | String | No | Valid URI / Path | High-res aesthetic pizza visual |
| `tags` | Array of String | No | e.g. `['Vegetarian', 'Chef Special']` | Filter tags |
| `isPopular` | Boolean | No | Default: `false` | Featured ribbon toggle |

---

## 4. Collection: `orders`

The core transactional entity binding customers, items, payments, inventory mutations, and real-time fulfillment states.

| Field Name | BSON Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `orderNumber` | String | No | Auto (e.g., `CC-58291`) | Human-readable public tracking number |
| `customer` | ObjectId | No | Ref: `User` | Foreign key referencing ordering user |
| `customerDetails` | Object | No | Embedded | Snapshot of contact name, email, delivery address, and phone |
| `items` | Array of Objects | No | At least 1 item | Embedded array of custom or preset pizzas ordered |
| `subtotal` | Number | No | Min: 0 | Sum of item totals |
| `tax` | Number | No | Min: 0 | Calculated state/local tax (8%) |
| `deliveryFee` | Number | No | `3.50` | Flat or distance-based fulfillment fee |
| `totalAmount` | Number | No | Calculated | Final charge amount (`subtotal + tax + deliveryFee`) |
| `payment` | Object | No | Embedded | Status (`pending`, `paid`, `failed`), Razorpay IDs |
| `orderStatus` | String | No | `'received'` | State enum: `received`, `in_kitchen`, `sent_to_delivery`, `delivered`, `cancelled` |
| `statusHistory` | Array of Objects | No | Logs timestamps | Audit trail of state transitions with ISO timestamps |
| `createdAt` | Date | No | `Date.now` | Order placement timestamp |

---

## 5. Indexing & Concurrency Constraints

1. **`users.email`:** Unique compound index ensuring zero duplicate registrations.
2. **`inventory_items.name` + `category`:** Unique compound index preventing identical ingredient records.
3. **`orders.orderNumber`:** Unique index for high-performance public tracking lookups.
4. **`orders.customer` + `createdAt`:** Compound index for customer order history queries.
5. **Atomic Decrement Invariant:**
   ```javascript
   // Query condition prevents negative stock allocation
   {
     name: itemName,
     stockQuantity: { $gte: requiredQuantity }
   }
   ```
