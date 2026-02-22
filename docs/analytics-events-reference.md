# Analytics Events Reference

Complete reference for all tracked events in the T-Shirt Shop application.

## Services

| Service       | Purpose                             | Tracking type                       |
| ------------- | ----------------------------------- | ----------------------------------- |
| **Amplitude** | Product analytics, funnels, cohorts | Custom events + autocapture         |
| **LogRocket** | Session replay, error tracking      | Custom events + automatic recording |
| **Hotjar**    | Heatmaps, session recordings        | Automatic (no custom events)        |

---

## Custom Events

### `User Login`

Fired when a user successfully authenticates.

**Source:** `src/context/AuthContext.tsx`
**Trigger:** Successful login API response
**Services:** Amplitude, LogRocket

| Property    | Type              | Example                      |
| ----------- | ----------------- | ---------------------------- |
| `userId`    | string            | `"user-abc123"`              |
| `email`     | string            | `"user@example.com"`         |
| `timestamp` | string (ISO 8601) | `"2026-02-22T10:00:00.000Z"` |

---

### `Product Selected`

Fired when a user opens a product detail page.

**Source:** `src/pages/ProductDetailPage.tsx`
**Trigger:** Product data loads on detail page
**Services:** Amplitude, LogRocket

| Property      | Type              | Example                      |
| ------------- | ----------------- | ---------------------------- |
| `productId`   | string            | `"prod-001"`                 |
| `productName` | string            | `"Classic White Tee"`        |
| `category`    | string            | `"men"`                      |
| `timestamp`   | string (ISO 8601) | `"2026-02-22T10:01:00.000Z"` |

---

### `Add to Cart`

Fired when a user adds a product to their cart.

**Source:** `src/pages/ProductDetailPage.tsx`
**Trigger:** User clicks "Add to Cart" button
**Services:** Amplitude, LogRocket

| Property      | Type              | Example                      |
| ------------- | ----------------- | ---------------------------- |
| `productId`   | string            | `"prod-001"`                 |
| `productName` | string            | `"Classic White Tee"`        |
| `price`       | number (dollars)  | `29.99`                      |
| `timestamp`   | string (ISO 8601) | `"2026-02-22T10:02:00.000Z"` |

---

### `Checkout Started`

Fired when a user navigates to the checkout page with items in their cart.

**Source:** `src/pages/CheckoutPage.tsx`
**Trigger:** Component mounts with non-empty cart
**Services:** Amplitude, LogRocket

| Property    | Type              | Example                      |
| ----------- | ----------------- | ---------------------------- |
| `cartValue` | number (dollars)  | `89.97`                      |
| `itemCount` | number            | `3`                          |
| `timestamp` | string (ISO 8601) | `"2026-02-22T10:03:00.000Z"` |

---

### `Order Placed`

Fired when a user successfully completes payment and an order is confirmed.

**Source:** `src/pages/PaymentPage.tsx`
**Trigger:** Successful payment API response
**Services:** Amplitude, LogRocket

| Property     | Type              | Example                      |
| ------------ | ----------------- | ---------------------------- |
| `orderId`    | string            | `"order-xyz789"`             |
| `orderValue` | number (dollars)  | `89.97`                      |
| `itemCount`  | number            | `3`                          |
| `timestamp`  | string (ISO 8601) | `"2026-02-22T10:04:00.000Z"` |

---

### `Search`

Fired when a user searches or filters products (debounced, 300 ms).

**Source:** `src/pages/ProductsPage.tsx`
**Trigger:** Search query or filter change (only when search/filters are active)
**Services:** Amplitude, LogRocket

| Property             | Type              | Example                      |
| -------------------- | ----------------- | ---------------------------- |
| `query`              | string            | `"blue shirt"`               |
| `filters.categories` | string[]          | `["men", "unisex"]`          |
| `filters.sizes`      | string[]          | `["M", "L"]`                 |
| `filters.colors`     | string[]          | `["blue"]`                   |
| `filters.minPrice`   | number            | `0`                          |
| `filters.maxPrice`   | number            | `100`                        |
| `timestamp`          | string (ISO 8601) | `"2026-02-22T10:00:30.000Z"` |

---

### `Page Viewed` (manual supplement)

Fired on pages where Amplitude autocapture page views need to be supplemented or explicitly named. Also sent to LogRocket for session context.

**Sources:** `HomePage.tsx`, `AboutPage.tsx`, `ProfilePage.tsx`
**Trigger:** Component mounts
**Services:** Amplitude, LogRocket

| Property    | Type              | Example                          |
| ----------- | ----------------- | -------------------------------- |
| `page`      | string            | `"Home"`, `"About"`, `"Profile"` |
| `timestamp` | string (ISO 8601) | `"2026-02-22T10:00:00.000Z"`     |

---

## Automatic Events (Amplitude Autocapture)

These events are tracked automatically by Amplitude's autocapture feature — no custom code required.

| Event                         | Trigger                                |
| ----------------------------- | -------------------------------------- |
| `[Amplitude] Page Viewed`     | Every route change                     |
| `[Amplitude] Element Clicked` | Any button, link, or clickable element |
| `[Amplitude] Form Started`    | User focuses first field in a form     |
| `[Amplitude] Form Submitted`  | Form submit action                     |
| `[Amplitude] Page Left`       | User navigates away or closes tab      |
| `[Amplitude] File Downloaded` | File download triggered                |

---

## User Identification

On login, users are identified across services so all subsequent events are associated with the logged-in user.

| Service   | Method                               | Data                                   |
| --------- | ------------------------------------ | -------------------------------------- |
| Amplitude | `amplitude.setUserId()` + `Identify` | userId, email, name, avatar, loginTime |
| LogRocket | `LogRocket.identify()`               | userId, email, name, avatar, loginTime |

---

## Purchase Funnel

The following events define the primary conversion funnel tracked in Amplitude:

```
Search           (ProductsPage)
    ↓
Product Selected (ProductDetailPage)
    ↓
Add to Cart      (ProductDetailPage)
    ↓
Checkout Started (CheckoutPage)
    ↓
Order Placed     (PaymentPage)
```

Configure this funnel in Amplitude under **Analytics → Funnels**.
