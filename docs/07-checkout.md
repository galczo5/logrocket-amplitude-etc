# Stage 7: Cart & Checkout

## Checklist

- [ ] Create `CartContext` with React context + provider
- [ ] Implement cart operations: add, remove, update quantity, clear
- [ ] Persist cart to localStorage
- [ ] Update header cart icon with item count badge
- [ ] Build checkout page with cart summary
- [ ] Build shipping information form
- [ ] Add form validation for shipping fields
- [ ] Add "Proceed to Payment" button that navigates to payment page
- [ ] Handle empty cart state

## Details

### 7.1 Cart Context (`src/context/CartContext.tsx`)

```ts
interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

- Unique cart items identified by `productId + size + color` combination
- `addItem` increments quantity if item already exists, otherwise adds new
- State persisted to localStorage and restored on mount

### 7.2 Header Cart Badge

Update the header (from Stage 1):
- Cart icon shows **badge** with `totalItems` count
- Badge hidden when count is 0
- Clicking the cart icon navigates to `/checkout`

### 7.3 Checkout Page Layout

```
┌────────────────────────┬──────────────────┐
│  Shipping Form         │  Order Summary   │
│                        │  ──────────────  │
│  Name                  │  Item 1    $XX   │
│  Email                 │  Item 2    $XX   │
│  Address               │  ──────────────  │
│  City                  │  Subtotal  $XX   │
│  State / ZIP           │  Shipping  $5.00 │
│  ─────────────────     │  ──────────────  │
│  [Proceed to Payment]  │  Total     $XX   │
└────────────────────────┴──────────────────┘
```

Desktop-only layout. Two columns always side by side.

### 7.4 Order Summary Section

Uses **card**, **separator**, and **table** components:

- List each cart item: name, size, color, quantity, line total
- Quantity adjustable with +/- buttons (updates cart context)
- Remove button per item
- Subtotal
- Shipping: flat $5.00 (free over $50)
- Total

### 7.5 Shipping Form

Uses **input**, **label**, **native-select** components:

| Field | Type | Required |
|-------|------|----------|
| Full Name | text input | Yes |
| Email | email input | Yes |
| Address | text input | Yes |
| City | text input | Yes |
| State | native-select (list of US states) | Yes |
| ZIP Code | text input | Yes |

Validation:
- All fields required
- Email format validation
- ZIP code: 5 digits
- Show inline error messages below invalid fields

### 7.6 Empty Cart State

If cart is empty when visiting `/checkout`:
- Show message: "Your cart is empty"
- **button** — "Continue Shopping" linking to `/products`

### 7.7 Navigation

On form submit (validation passes):
- Store shipping data in state/context (or pass via router state)
- Navigate to `/checkout/payment`
