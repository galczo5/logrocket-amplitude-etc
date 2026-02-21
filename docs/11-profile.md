# Stage 11: User Profile Page

## Checklist

- [ ] Create `ProfilePage` component at `src/pages/ProfilePage.tsx`
- [ ] Add `/profile` route to the router (auth-guarded)
- [ ] Add "Profile" link to the header when user is authenticated
- [ ] Display user details from `AuthContext`
- [ ] Display order history fetched from `GET /api/orders`
- [ ] Add backend endpoint `GET /api/orders` returning the current user's orders

## Details

### 11.1 Page Layout

Two-column layout (sidebar + main content):

```
┌───────────────┬──────────────────────────────┐
│  Avatar       │  Order History               │
│  Name         │                              │
│  Email        │  [ Order card ]              │
│  Member since │  [ Order card ]              │
│               │  [ Order card ]              │
│  [Sign Out]   │                              │
└───────────────┴──────────────────────────────┘
```

- Left column: ~1/3 width, user info card
- Right column: ~2/3 width, order history list

### 11.2 User Info Card (Left Column)

Uses the `User` type from `src/types/user.ts`:

```ts
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}
```

Displayed fields:

| Field | Display |
|-------|---------|
| Avatar | Circular image if `avatar` is set, otherwise initials fallback (first letter of name) |
| Name | Large text below avatar |
| Email | Muted text below name |
| User ID | Small muted label, e.g. "ID: usr_abc123" |

- **button** (variant=outline, full width) — "Sign Out" — calls `authContext.logout()` and navigates to `/`

### 11.3 Order History (Right Column)

Fetch from `GET /api/orders` (requires `Authorization: Bearer <token>` header, use `src/lib/api.ts`).

**Loading state:** show **spinner** while fetching.

**Empty state:** if no orders, show a message — "No orders yet." with a **button** linking to `/products` ("Start Shopping").

**Order card** (one per order, using **card**):

```
┌────────────────────────────────────────────┐
│  Order #ORD-1234          [badge: status]  │
│  Placed on: Jan 15, 2025                   │
│  ─────────────────────────────────────────  │
│  White Classic Tee × 1        $29.99       │
│  Black Graphic Tee × 2        $59.98       │
│  ─────────────────────────────────────────  │
│  Total: $89.97                             │
└────────────────────────────────────────────┘
```

Order fields to display:

| Field | Notes |
|-------|-------|
| Order ID | e.g. "Order #ORD-1234" |
| Status | **badge** — "confirmed" (green), "pending" (yellow) |
| Date | Formatted as `MMM DD, YYYY` |
| Line items | Product name × quantity + line total |
| Order total | Sum of all items + shipping |

### 11.4 Backend: `GET /api/orders`

Add to the Express server. Returns orders associated with the authenticated user (matched by user ID from the token).

Since all data is mocked, seed a few example orders for every user on server start:

```ts
interface Order {
  id: string;           // e.g. "ORD-1234"
  userId: string;
  status: "confirmed" | "pending";
  createdAt: string;    // ISO date string
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  total: number;
}
```

Response: `{ orders: Order[] }`

### 11.5 Auth Guard

- If the user is not authenticated, redirect to `/login?next=/profile`
- The login page already supports `location.state?.from` for post-login redirect — pass the current path via the router's `state`

### 11.6 Components Used

- **card** (CardHeader, CardContent) — user info panel and each order card
- **badge** — order status
- **button** — Sign Out, Start Shopping
- **separator** — between order header and items
- **spinner** — loading state
