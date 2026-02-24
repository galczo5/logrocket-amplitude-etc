# Stage 14: Developer Mode Quick Login

## Checklist

- [ ] Add a second mock user ("Not John Doe") to `server/data/users.ts`
- [ ] Update `POST /api/auth/login` to accept an optional `userId` field for dev login
- [ ] Add "Developer Mode" button group to `LoginPage.tsx` (below the sign-in form)
- [ ] Wire dev login buttons to call login with the correct user
- [ ] **MANUAL** — Verify clicking "John Doe" logs in as John Doe
- [ ] **MANUAL** — Verify clicking "Not John Doe" logs in as Not John Doe
- [ ] Add `resetUser()` to `src/lib/analytics.ts` (resets Amplitude, LogRocket, Hotjar identity)
- [ ] Call `resetUser()` in `logout()` so analytics services clear stale user data
- [ ] **MANUAL** — Verify analytics identification works correctly for both users
- [ ] **MANUAL** — Verify logging out then in as a different user shows correct identity in analytics

## Overview

Add a "Developer Mode" section to the login page with two quick-login buttons — one for each mock user. This lets developers skip typing credentials during testing while still exercising the full auth flow (API call, token storage, analytics identification).

**Users:**

| ID       | Name         | Email                    |
| -------- | ------------ | ------------------------ |
| `user-1` | John Doe     | `john@example.com`       |
| `user-2` | Not John Doe | `notjohn@example.com`    |

## Implementation Plan

### Phase 1: Add Second Mock User

**File:** `server/data/users.ts`

Add a second user to the users data:

```typescript
export const users = [
  {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: null,
  },
  {
    id: 'user-2',
    email: 'notjohn@example.com',
    name: 'Not John Doe',
    avatar: null,
  },
];
```

### Phase 2: Update Auth Endpoint

**File:** `server/routes/auth.ts`

Update `POST /api/auth/login` to support a `userId` query parameter (or body field) for dev quick-login. When `userId` is provided, look up the user by ID instead of using the default. When no `userId` is provided, keep the existing behavior (return the first user for any email/password combo).

```typescript
// If userId is provided, find that specific user (dev login)
// Otherwise, fall back to existing behavior (return first user)
const { email, password, userId } = req.body;

let user;
if (userId) {
  user = users.find((u) => u.id === userId);
} else {
  user = users[0]; // existing behavior — any credentials work
}
```

### Phase 3: Add Developer Mode Buttons to Login Page

**File:** `src/pages/LoginPage.tsx`

Add a visually distinct "Developer Mode" section below the existing sign-in card. The section should contain:

- A separator or divider
- A label: "Developer Mode"
- Two buttons side-by-side:
  - **"John Doe"** — calls the login API with `userId: 'user-1'`
  - **"Not John Doe"** — calls the login API with `userId: 'user-2'`

The buttons should use a secondary/outline style to visually distinguish them from the main sign-in flow.

### Phase 4: Reset Analytics Identity on Logout

**Problem:** Currently `logout()` in `AuthContext.tsx` only clears local state (user/token). It never resets user identity in Amplitude, LogRocket, or Hotjar. If you log out as "John Doe" and log back in as "Not John Doe", all three services will still have John Doe's identity attached until the new `setUserId` call — and stale user properties (email, name, avatar) may persist even after that.

**File:** `src/lib/amplitude.ts`

Add a `reset` function that calls Amplitude's `reset()` — this clears the userId and generates a new device ID:

```typescript
export const reset = () => {
  if (KEYS.AMPLITUDE_API_KEY) {
    amplitude.reset();
  }
};
```

**File:** `src/lib/analytics.ts`

Add a `resetUser` function that resets identity across all services:

```typescript
/**
 * Reset user identity across all analytics services.
 * Call on logout to ensure the next login gets a clean identity.
 */
export const resetUser = () => {
  amplitudeLib.reset();
  // LogRocket doesn't support un-identifying; a new session starts on page reload.
  // Calling identify with anonymous context signals the user logged out.
  logRocketLib.setUserContext({ loggedIn: false });
  // Clear Hotjar identity
  if (typeof window !== 'undefined' && (window as { hj?: Function }).hj) {
    (window as { hj?: Function }).hj!('identify', null, {});
  }
};
```

**File:** `src/context/AuthContext.tsx`

Update `logout()` to call `resetUser()` before clearing state:

```typescript
import { setUserId, setUserProperties, trackUserLogin, resetUser } from '@/lib/analytics';

function logout() {
  resetUser();
  setUser(null);
  setToken(null);
}
```

### Phase 5: Wire Dev Login to AuthContext

**File:** `src/context/AuthContext.tsx`

Add a `devLogin(userId: string)` method to the auth context that sends a POST to `/api/auth/login` with the `userId` field (email and password can be empty or omitted). The rest of the flow (token storage, analytics identification) remains identical to the normal `login()` method.

Alternatively, extend the existing `login()` to accept an optional `userId` parameter, keeping the logic DRY.

## Files Changed

| File                              | Change                                                  |
| --------------------------------- | ------------------------------------------------------- |
| `server/data/users.ts`           | Add second mock user ("Not John Doe")                   |
| `server/routes/auth.ts`          | Support `userId` field in login request body             |
| `src/lib/amplitude.ts`           | Add `reset()` function to clear Amplitude identity      |
| `src/lib/analytics.ts`           | Add `resetUser()` that resets identity across all services |
| `src/context/AuthContext.tsx`     | Add `devLogin(userId)` method; call `resetUser()` on logout |
| `src/pages/LoginPage.tsx`        | Add "Developer Mode" section with two quick-login buttons |

## Key Considerations

### Security

- This is a development-only convenience feature. The entire auth system is already a mock (accepts any credentials), so the dev login buttons don't introduce any new security concerns.
- If the app ever moves to real authentication, the dev login section should be gated behind an environment variable (e.g., `VITE_DEV_LOGIN=true`).

### UX

- The developer mode section should be visually separated from the regular login form so it's clearly distinct.
- Buttons should show a loading state while the login request is in flight, same as the regular sign-in button.
- After clicking a dev login button, the user should be redirected the same way as a normal login (to the referrer page or `/`).

### Analytics

- Dev logins should trigger the same analytics events as normal logins (`User Login`, user identification) so that analytics integration can be tested with both users.
- **Logout resets identity** — `logout()` now calls `resetUser()` which:
  - **Amplitude:** calls `amplitude.reset()` — clears userId and generates a new anonymous device ID
  - **LogRocket:** sets user context to `{ loggedIn: false }` — LogRocket doesn't support un-identifying mid-session, but this flags the transition; a full reset happens on page reload
  - **Hotjar:** clears identity via `hj('identify', null, {})`
- This ensures that switching between "John Doe" and "Not John Doe" gives each user a clean analytics identity with no stale properties carried over.
