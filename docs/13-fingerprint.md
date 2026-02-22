# Stage 13: Fingerprint Integration (Anonymous Visitor Tracking)

## Checklist

- [ ] Install dependency: `@fingerprintjs/fingerprintjs`
- [ ] Add `setFingerprintId()` to `src/lib/analytics.ts`
- [ ] Update `src/lib/initializeAnalytics.ts` with async FingerprintJS init
- [ ] **MANUAL** - Verify `[Analytics] Fingerprint initialized` log in browser console
- [ ] **MANUAL** - Verify `fingerprintVisitorId` appears in Amplitude user properties
- [ ] **MANUAL** - Verify `fingerprintVisitorId` appears in LogRocket session user context
- [ ] **MANUAL** - Verify `fingerprint_visitor_id` appears in Hotjar visitor tags

## Overview

Add browser fingerprinting via the free `@fingerprintjs/fingerprintjs` package to generate a stable `visitorId` for anonymous visitor tracking. The `visitorId` is passed to all three analytics services (Amplitude, LogRocket, Hotjar) as a user property, enabling cross-session correlation even before a user logs in.

**Why fingerprinting?**
- Tracks users across sessions without cookies
- Works in incognito/private mode
- Provides a stable anonymous ID before authentication
- Correlates sessions across all analytics tools

**Key constraint:** The free version is fully client-side with ~40-60% accuracy. No API key or account required.

## Architecture Notes

- **No API key needed** — free version is fully client-side, no env var required
- **Non-blocking** — fingerprint loads asynchronously; app renders normally while it resolves
- **Property, not identity** — `visitorId` is set as a user property, not as the primary user ID. Authenticated user IDs (set by `AuthContext`) take precedence for identity
- **Single call** — `FingerprintJS.load()` is called once at startup in `initializeAnalytics()`

## Implementation Plan

### Phase 1: Install Dependency

```bash
yarn add @fingerprintjs/fingerprintjs
```

No environment variables or API keys needed.

### Phase 2: Add `setFingerprintId` to Analytics Unified Interface

**File:** `src/lib/analytics.ts`

Add after the existing `setUserProperties` function:

```typescript
/**
 * Set fingerprint visitor ID as anonymous identifier across all analytics services.
 * Called once at app startup for anonymous tracking before user login.
 */
export const setFingerprintId = (visitorId: string, confidence: number) => {
  amplitudeLib.setUserProperties({
    fingerprintVisitorId: visitorId,
    fingerprintConfidence: confidence,
  });
  logRocketLib.setUserContext({
    fingerprintVisitorId: visitorId,
    fingerprintConfidence: confidence,
  });
  // Hotjar identify API for visitor tagging
  if (typeof window !== 'undefined' && (window as { hj?: Function }).hj) {
    (window as { hj?: Function }).hj!('identify', null, {
      fingerprint_visitor_id: visitorId,
      fingerprint_confidence: confidence,
    });
  }
};
```

### Phase 3: Initialize FingerprintJS in `initializeAnalytics`

**File:** `src/lib/initializeAnalytics.ts`

Add the import at the top:
```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setFingerprintId } from './analytics';
```

Add after the existing three service init blocks, inside `initializeAnalytics()`:
```typescript
// Initialize Fingerprint for anonymous visitor tracking (free, client-side)
FingerprintJS.load()
  .then(fp => fp.get())
  .then(result => {
    setFingerprintId(result.visitorId, result.confidence.score);
    console.log('[Analytics] Fingerprint initialized:', result.visitorId);
  })
  .catch(error => {
    console.error('[Analytics] Failed to initialize Fingerprint:', error);
  });
```

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `@fingerprintjs/fingerprintjs` |
| `src/lib/analytics.ts` | Add `setFingerprintId(visitorId, confidence)` function |
| `src/lib/initializeAnalytics.ts` | Import FingerprintJS and call async init at end of `initializeAnalytics()` |

No changes to: `src/keys.ts`, `src/lib/amplitude.ts`, `src/lib/logrocket.ts`, or any page files.

## Key Considerations

### Accuracy
- Free version: ~40-60% accuracy (client-side only)
- Confidence score (0-1) is passed alongside `visitorId` so you can filter low-confidence results in dashboards
- For higher accuracy, upgrade to Fingerprint Pro (requires API key + env var)

### Privacy & GDPR
- Browser fingerprinting collects device/browser attributes — disclose in your privacy policy
- No PII is collected by the fingerprint library itself
- Consider gating fingerprint init behind a consent check if operating in GDPR regions

### Identity Priority
- Fingerprint `visitorId` → anonymous user property (always set)
- Authenticated user ID → primary identity (set by `AuthContext` on login, overrides anonymous)
- Both coexist as properties, enabling pre-login → post-login session stitching in analytics

## References

- [@fingerprintjs/fingerprintjs on npm](https://www.npmjs.com/package/@fingerprintjs/fingerprintjs)
- [FingerprintJS GitHub](https://github.com/fingerprintjs/fingerprintjs)
- [FingerprintJS API Docs](https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/api.md)
