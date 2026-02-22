# Stage 12: Analytics Integration (Amplitude, LogRocket, Hotjar)

## Checklist

- [x] Create `src/keys.ts` with centralized configuration
- [x] Create `.env.example` with placeholder values
- [x] Add `.env` to `.gitignore` (prevent accidental commits)
- [x] Install dependencies: `logrocket`, `logrocket-react`, `@amplitude/analytics-browser`, `react-hotjar`
- [x] Create `src/lib/analytics.ts` with helper functions
- [ ] Initialize LogRocket in `src/main.tsx`
- [ ] Initialize Amplitude in `src/main.tsx`
- [ ] Initialize Hotjar in `src/main.tsx`
- [ ] Integrate with `src/context/AuthContext.tsx` for user identification
- [ ] Track "User Login" event on authentication
- [ ] Track "Product Viewed" events on product pages
- [ ] Track "Product Details Opened" on product detail page
- [ ] Track "Add to Cart" and "Remove from Cart" events
- [ ] Track "Checkout Started" on checkout page
- [ ] Track "Payment Completed" and "Order Placed" events
- [ ] Add page view tracking to all routes
- [ ] Verify analytics appear in all three service dashboards
- [ ] Test session replay in LogRocket
- [ ] Test heatmaps/recordings in Hotjar
- [ ] Verify funnel analysis in Amplitude
- [ ] Document all tracked events in a events reference guide
- [ ] Create developer guide for adding new analytics events

## Overview

Integrate three user monitoring and analytics tools into the T-Shirt Shop application:
- **Amplitude** - Product analytics and user behavior tracking
- **LogRocket** - Session replay and error tracking
- **Hotjar** - User feedback, heatmaps, and recordings

All API keys and configuration will be centralized in `src/keys.ts` to allow easy environment-based configuration.

## Architecture

### Key Storage (`src/keys.ts`)

Create a centralized configuration file that exports all third-party service credentials:

```typescript
// src/keys.ts
export const KEYS = {
  AMPLITUDE_API_KEY: import.meta.env.VITE_AMPLITUDE_API_KEY || '',
  LOGROCKET_APP_ID: import.meta.env.VITE_LOGROCKET_APP_ID || '',
  HOTJAR_SITE_ID: import.meta.env.VITE_HOTJAR_SITE_ID || '',
};
```

### Environment Variables

Create a `.env.example` file documenting required keys:

```
VITE_AMPLITUDE_API_KEY=<your-amplitude-api-key>
VITE_LOGROCKET_APP_ID=<your-logrocket-app-id>
VITE_HOTJAR_SITE_ID=<your-hotjar-site-id>
```

## Key Features Summary

- **LogRocket** → Session replay + error tracking (no config needed)
- **Amplitude** → Event analytics with **automatic event capture** (autocapture enabled)
- **Hotjar** → Heatmaps + user feedback + recordings (no config needed)

## Service Integration Details

### 1. LogRocket

**Purpose:** Session replay, console logging, network monitoring, and error tracking

**Integration Point:** Initialize in `src/main.tsx` before app renders

**Key Requirements:**
- Initializes with App ID (public key, safe in frontend)
- Captures network requests, console logs, DOM mutations
- Records user sessions for playback
- No PII tracking by default (can be configured)

**Dependencies:**
- `logrocket` (core SDK)
- `logrocket-react` (React plugin for component filtering)

**Initialization Code:**
```typescript
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (KEYS.LOGROCKET_APP_ID) {
  LogRocket.init(KEYS.LOGROCKET_APP_ID);
  setupLogRocketReact(LogRocket);
}
```

**Reference:** [LogRocket React Plugin](https://docs.logrocket.com/reference/react-plugin-1)

### 2. Amplitude

**Purpose:** Event-based product analytics, user behavior tracking, funnels

**Integration Point:** Initialize in `src/main.tsx` after LogRocket

**Key Requirements:**
- Initializes with API Key
- **Autocapture enabled** - automatically tracks common events (page views, clicks, form submissions)
- Custom events for domain-specific tracking (login, checkout, etc.)
- Session and user identification
- Official TypeScript SDK (not the deprecated react-amplitude)

**Dependencies:**
- `@amplitude/analytics-browser` (official browser SDK 2.0)

**Initialization Code:**
```typescript
import * as amplitude from '@amplitude/analytics-browser';

if (KEYS.AMPLITUDE_API_KEY) {
  amplitude.init(KEYS.AMPLITUDE_API_KEY, {
    autocapture: {
      pageViews: true,        // Track page views
      formInteractions: true, // Track form submissions
      fileDownloads: true,    // Track file downloads
      pageLeaves: true,       // Track when users leave the page
    },
  });
}
```

**Auto-Tracked Events:**
- Page views
- Button clicks
- Form interactions
- Navigation events
- File downloads

**Custom Events to Track:**
- User authentication (login)
- Product views (enhanced tracking)
- Add to cart / Remove from cart
- Checkout initiation
- Payment completion
- Custom business metrics

**Reference:** [Amplitude Browser SDK 2 Documentation](https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2)

### 3. Hotjar

**Purpose:** User feedback, heatmaps, session recordings, surveys

**Integration Point:** Initialize in `src/main.tsx` after Amplitude

**Key Requirements:**
- Initializes with Site ID (from your Hotjar account)
- Snippet Version (usually 6 for current tracking code)
- Captures heatmaps, form analytics, user feedback
- Optional: debug mode for testing

**Dependencies:**
- `react-hotjar` (React wrapper for Hotjar)

**Initialization Code:**
```typescript
import { initialize } from 'react-hotjar';

if (KEYS.HOTJAR_SITE_ID) {
  initialize({
    id: parseInt(KEYS.HOTJAR_SITE_ID),
    sv: 6,
    debug: import.meta.env.DEV,
  });
}
```

**Reference:** [react-hotjar npm](https://www.npmjs.com/package/react-hotjar)

## Implementation Plan

### Phase 1: Foundation Setup

#### Task 1.1: Create Keys Configuration File
- [ ] Create `src/keys.ts` with KEYS export
- [ ] Create `.env.example` with placeholder values
- [ ] Add environment variables to `.env` (local development only)

#### Task 1.2: Install Dependencies
```bash
yarn add logrocket logrocket-react @amplitude/analytics-browser react-hotjar
```

#### Task 1.3: Initialize in main.tsx
- [ ] Import KEYS from `src/keys.ts`
- [ ] Initialize LogRocket first
- [ ] Initialize Amplitude second
- [ ] Initialize Hotjar last
- [ ] Add initialization code to `src/main.tsx`
- [ ] Test initialization (check browser console for logs)

### Phase 2: Event Tracking Setup

#### Task 2.1: Create Analytics Utilities
- [ ] Create `src/lib/analytics.ts` with helper functions:
  - `trackEvent(name: string, properties?: Record<string, any>)` - for custom events
  - `setUserId(userId: string)` - identify users in Amplitude/LogRocket
  - `setUserProperties(properties: Record<string, any>)` - set user attributes

#### Task 2.2: Integrate with Auth Context
- [ ] Update `src/context/AuthContext.tsx` to call `setUserId()` on login
- [ ] Track custom "User Login" event on successful authentication with user properties (email, tier, etc.)

#### Task 2.3: Track Domain-Specific Events (Autocapture Handles Basic Events)
With autocapture enabled, clicks, form submissions, and page views are tracked automatically.
Add custom tracking for:
- [ ] Checkout Page: Track "Checkout Started" event with cart value
- [ ] Payment: Track "Payment Completed" and "Order Placed" events with order details
- [ ] Product Detail Page: Track "Product Selected" with product ID/name
- [ ] Cart Actions: Track "Add to Cart" and "Remove from Cart" with product details
- [ ] Search/Filter: Track search queries and applied filters

### Phase 3: Configuration & Testing

#### Task 3.1: Environment Configuration
- [ ] Set up dev environment variables
- [ ] Create production environment variable instructions
- [ ] Document where to find API keys for each service:
  - LogRocket: [https://app.logrocket.com](https://app.logrocket.com)
  - Amplitude: [https://analytics.amplitude.com](https://analytics.amplitude.com)
  - Hotjar: [https://app.hotjar.com](https://app.hotjar.com)

#### Task 3.2: Testing & Validation
- [ ] Test in development with debug logs enabled
- [ ] Verify events appear in each service's dashboard
- [ ] Check session replay in LogRocket
- [ ] Verify heatmaps/recordings in Hotjar
- [ ] Confirm funnel analysis data in Amplitude

#### Task 3.3: Documentation
- [ ] Document all tracked events
- [ ] Create developer guide for adding new events
- [ ] Add setup instructions in README

## Development Setup

See [ENV_SETUP.md](./ENV_SETUP.md) for complete instructions on:
- Getting API keys for each service
- Setting up your local `.env` file
- How environment variables work in development and production
- Troubleshooting common issues

**Quick summary:**
1. Copy `.env.example` to `.env`
2. Follow ENV_SETUP.md to get your API keys
3. Fill in `.env` with your keys
4. Run `yarn dev` and verify no errors in browser console

## Key Considerations

### Performance
- LogRocket and Hotjar load external scripts - consider lazy initialization
- Amplitude is lightweight - safe to initialize immediately

### Privacy & GDPR
- All three services support privacy controls
- Consider implementing consent banner before initializing
- Document data collection in privacy policy

### Error Handling
- If any service fails to initialize, app should continue working
- Log initialization errors but don't break the app

### Data Storage
- LogRocket: Records sessions up to 1 hour by default
- Amplitude: Sessions tracked across pages
- Hotjar: Continuous recording (up to plan limits)

## Success Criteria

- [ ] All three services initialize without errors
- [ ] **Amplitude**: Page views and clicks auto-tracked via autocapture
- [ ] **Amplitude**: Custom events (login, checkout, etc.) tracked correctly
- [ ] **LogRocket**: Session replays available with network activity
- [ ] **Hotjar**: Heatmaps visible after user activity
- [ ] **Amplitude**: Funnel analysis works (checkout flow)
- [ ] **All services**: User identification working across services
- [ ] No console errors or warnings
- [ ] App performance not noticeably impacted

## References

- [LogRocket React Plugin Documentation](https://docs.logrocket.com/reference/react-plugin-1)
- [Amplitude Official Documentation](https://amplitude.com/docs)
- [react-hotjar npm Package](https://www.npmjs.com/package/react-hotjar)
- [Amplitude TypeScript SDK](https://www.npmjs.com/package/@amplitude/analytics-browser)
