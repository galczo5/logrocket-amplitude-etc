# Stage 8: Payment & Order Confirmation

## Checklist

- [x] Build payment form (card number, expiry, CVC, cardholder name) prefilled with mock data
- [x] Add payment form validation
- [x] Show order summary (read-only) alongside payment form
- [x] Implement "Place Order" submission to `POST /api/orders`
- [x] Build order confirmation view with order ID and details
- [x] Clear cart after successful order
- [x] Add progress indicator across checkout steps
- [x] Handle error states

## Details

### 8.1 Checkout Progress Indicator

A simple step indicator shown on both checkout and payment pages (using **progress** or styled divs):

```
  (1) Cart Review  ——  (2) Shipping  ——  (3) Payment
       [done]            [done]          [current]
```

### 8.2 Payment Page Layout

```
┌────────────────────────┬──────────────────┐
│  Payment Form          │  Order Summary   │
│                        │  (read-only)     │
│  Cardholder Name       │  Items...        │
│  Card Number           │  Subtotal  $XX   │
│  Expiry    CVC         │  Shipping  $XX   │
│                        │  ──────────────  │
│  [Place Order - $XX]   │  Total     $XX   │
└────────────────────────┴──────────────────┘
```

### 8.3 Payment Form

Uses **input**, **label** components:

| Field           | Type | Validation                                             |
| --------------- | ---- | ------------------------------------------------------ |
| Cardholder Name | text | Required                                               |
| Card Number     | text | Required, 16 digits (formatted as XXXX XXXX XXXX XXXX) |
| Expiry Date     | text | Required, MM/YY format                                 |
| CVC             | text | Required, 3 digits                                     |

All validation is client-side only (no real payment processing).

**Prefilled mock values:**

- Cardholder Name: `John Doe`
- Card Number: `4242 4242 4242 4242`
- Expiry Date: `12/28`
- CVC: `123`

The user can edit these values but they are pre-populated so the checkout flow can be tested quickly.

Input masking:

- Card number: auto-insert spaces every 4 digits
- Expiry: auto-insert `/` after 2 digits
- CVC: limit to 3 characters

### 8.4 Place Order Flow

1. Validate all payment fields
2. Show **spinner** on the "Place Order" button
3. Call `POST /api/orders` with payload:
   ```json
   {
     "items": [...cartItems],
     "shipping": { ...shippingData },
     "payment": {
       "cardholderName": "...",
       "lastFour": "1234"
     }
   }
   ```
   (Never send full card number to the server — only last 4 digits)
4. On success: show confirmation view
5. On error: show **alert** with error message

### 8.5 Order Confirmation View

Replaces the payment form after a successful order:

- Large checkmark icon or success message
- "Order Confirmed!" heading
- Order ID displayed (e.g., "Order #ORD-1234")
- Summary of what was ordered (items, total)
- Shipping address
- **button** — "Continue Shopping" linking to `/products`
- **button** — "Back to Home" linking to `/`
- Cart is cleared via `cartContext.clearCart()`

### 8.6 Guards

- If cart is empty, redirect to `/checkout`
- If no shipping data, redirect to `/checkout`
- Prevent double-submission (disable button after first click)
