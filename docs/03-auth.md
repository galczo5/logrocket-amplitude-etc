# Stage 3: Authentication (Login Page & Auth Context)

## Checklist

- [ ] Create `AuthContext` with React context + provider
- [ ] Implement login/logout functions in the context
- [ ] Build the Login page UI with email and password fields
- [ ] Connect login form to `POST /api/auth/login`
- [ ] Store auth state (user + token) in localStorage for persistence
- [ ] Update header to show user name when logged in / Login link when not
- [ ] Add logout functionality
- [ ] Redirect to previous page after login (or home)

## Details

### 3.1 Auth Context (`src/context/AuthContext.tsx`)

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

- On mount, check `localStorage` for existing token/user
- `login()` calls `POST /api/auth/login`, stores result in state + localStorage
- `logout()` clears state + localStorage

### 3.2 Login Page (`src/pages/LoginPage.tsx`)

UI built with existing shadcn components:

- **card** — wraps the form
- **input** — email field (type="email") and password field (type="password")
- **label** — for each input
- **button** — submit button

Layout:
- Centered on the page (max-w-md, mx-auto)
- Card title: "Sign In"
- Card description: "Enter any email and password to continue"
- Email input
- Password input
- "Sign In" button (full width)
- Basic client-side validation (both fields required)

On submit:
1. Call `authContext.login(email, password)`
2. On success, navigate to the page the user came from (using `location.state?.from` or default to `/`)
3. Show spinner on the button while the request is in flight

### 3.3 Header Updates

- When **not authenticated**: show "Sign In" link/button on the right side of the nav
- When **authenticated**: show user name and a logout button/dropdown
- Cart icon always visible (badge shows item count from cart context — implemented in Stage 7)

### 3.4 API Utility (`src/lib/api.ts`)

Create a thin fetch wrapper that:
- Prepends `/api` to paths
- Includes `Authorization: Bearer <token>` header when token exists
- Parses JSON responses
- Throws on non-OK status codes

This will be reused across all pages.
