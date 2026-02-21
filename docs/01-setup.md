# Stage 1: Project Setup & Routing

## Checklist

- [ ] Install `react-router` dependency
- [ ] Create app layout with header and footer
- [ ] Set up React Router with all routes
- [ ] Create placeholder page components
- [ ] Add navigation menu to header
- [ ] Configure Vite proxy to forward `/api` requests to Express server
- [ ] Verify all routes render correctly

## Details

### 1.1 Install Dependencies

```bash
yarn add react-router
```

### 1.2 App Layout (`src/components/layout/`)

Create a shared layout that wraps every page:

**`AppLayout.tsx`**
- Uses the existing `navigation-menu` component for the top nav
- Logo/brand name on the left ("T-Shirt Shop")
- Nav links: Home, Products
- Right side: Cart icon with item count badge (using `badge`), Login/User button
- Footer with basic copyright text
- `<Outlet />` in the middle for page content

### 1.3 Router Setup (`src/router.tsx`)

Use **HashRouter** (`createHashRouter`) so all routes are prefixed with `#`:

```
#/                  → HomePage
#/login             → LoginPage
#/products          → ProductsPage
#/products/:id      → ProductDetailPage
#/checkout          → CheckoutPage
#/checkout/payment  → PaymentPage
```

All routes wrapped in `AppLayout`.

### 1.4 Placeholder Pages (`src/pages/`)

Create one file per page, each exporting a simple component with just the page title rendered so routing can be verified:

- `src/pages/HomePage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/ProductsPage.tsx`
- `src/pages/ProductDetailPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/PaymentPage.tsx`

### 1.5 Vite Proxy

In `vite.config.ts`, add a dev server proxy so the frontend can call `/api/*` and have it forwarded to `http://localhost:3001`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### 1.6 Update Entry Point

Replace the default Vite template content in `App.tsx` / `main.tsx` with the hash router provider (`RouterProvider` with the hash router instance).

> **Note:** The application is desktop-only. No responsive/mobile layouts are needed — design for a minimum viewport width of ~1200px.
