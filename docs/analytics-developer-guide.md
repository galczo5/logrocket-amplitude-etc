# Analytics Developer Guide

How to add new analytics tracking to the T-Shirt Shop application.

## Architecture Overview

Events flow through a single unified interface:

```
Your component
    ↓
src/lib/analytics.ts   ← unified API (use this)
    ↓ ↓
Amplitude   LogRocket   (Hotjar is automatic)
```

Always import from `@/lib/analytics` — never call Amplitude or LogRocket SDKs directly in components. This keeps all routing logic in one place and makes it easy to change services later.

---

## Adding a New Event

### Step 1: Define the event in `analytics.ts`

Open `src/lib/analytics.ts` and add a typed helper function:

```typescript
/**
 * Track wishlist add event
 */
export const trackAddToWishlist = (productId: string, productName: string) => {
  amplitudeLib.trackEvent('Add to Wishlist', { productId, productName });
  logRocketLib.trackEvent('Add to Wishlist', { productId, productName });
};
```

Keep event names in **Title Case** with spaces (e.g. `"Add to Wishlist"`, not `"add_to_wishlist"` or `"addToWishlist"`). This matches the existing convention and how Amplitude displays events.

### Step 2: Call it in your component

```typescript
import { trackAddToWishlist } from '@/lib/analytics';

function handleAddToWishlist() {
  addToWishlist(product.id);
  trackAddToWishlist(product.id, product.name);
}
```

### Step 3: Document it

Add the event to `docs/analytics-events-reference.md` with:
- Event name
- Source file and trigger
- All properties with types and examples

---

## Tracking Page Views

Each page component should fire `trackPageView` on mount:

```typescript
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function MyPage() {
  useEffect(() => {
    trackPageView('My Page Name');
  }, []);

  // ...
}
```

Use a human-readable name that will appear in dashboards (e.g. `"Product Detail"`, not `"/products/:id"`).

Note: Amplitude autocapture already records page views automatically. The manual `trackPageView` call supplements this with a named event that appears in LogRocket sessions and gives you a consistent event name in Amplitude funnels.

---

## Using Generic `trackEvent`

For one-off events that don't need a dedicated helper:

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('Promo Banner Clicked', {
  bannerId: 'summer-sale',
  position: 'hero',
});
```

Use this sparingly — prefer typed helper functions for important business events so the call sites are easy to find and the properties are consistent.

---

## User Identification

User identification is handled automatically in `AuthContext.tsx` on login. You don't need to call `setUserId` anywhere else.

If you need to attach additional user properties after login:

```typescript
import { setUserProperties } from '@/lib/analytics';

setUserProperties({
  subscriptionTier: 'premium',
  preferredCategory: 'men',
});
```

---

## Error Tracking

Capture errors with context so they appear in LogRocket session replays:

```typescript
import { captureError } from '@/lib/analytics';

try {
  await api.post('/checkout', payload);
} catch (error) {
  captureError(error as Error, { context: 'checkout-submit', cartSize: items.length });
  // handle error in UI...
}
```

---

## Service-Specific Access

For advanced use cases that the unified API doesn't cover, you can access the underlying service modules directly:

```typescript
import { amplitude, logRocket } from '@/lib/analytics';

// Amplitude-only feature
amplitude.trackEvent('A/B Test Exposure', { variant: 'B' });

// LogRocket-only feature
logRocket.captureException(error, { severity: 'critical' });
```

This should be rare — if you find yourself doing this often, consider adding the functionality to the unified API.

---

## Testing Events Locally

1. Copy `.env.example` to `.env` and add real API keys (see `docs/ENV_SETUP.md`)
2. Run `yarn dev`
3. Open the browser console — analytics calls log to the console when keys are present
4. Check each service's dashboard for incoming events:
   - Amplitude: **Events** tab shows events in near-real-time
   - LogRocket: **Sessions** tab — find your session and inspect the event timeline
   - Hotjar: **Recordings** — sessions appear after ~30 seconds of activity

---

## Conventions

| Convention | Example |
|---|---|
| Event names: Title Case | `"Add to Cart"`, `"Order Placed"` |
| Page names: Title Case | `"Home"`, `"Product Detail"` |
| Prices: always in dollars (not cents) | `trackAddToCart(id, name, price / 100)` |
| IDs: pass the raw ID string | `trackProductSelected(product.id, ...)` |
| Timestamps: auto-added by amplitude.ts | Don't pass `timestamp` manually |

---

## Files Reference

| File | Purpose |
|---|---|
| `src/lib/analytics.ts` | Unified API — import from here in components |
| `src/lib/amplitude.ts` | Amplitude-specific implementation |
| `src/lib/logrocket.ts` | LogRocket-specific implementation |
| `src/lib/initializeAnalytics.ts` | Service initialization (called once in main.tsx) |
| `src/keys.ts` | API key configuration from environment variables |
| `docs/analytics-events-reference.md` | All tracked events with properties |
