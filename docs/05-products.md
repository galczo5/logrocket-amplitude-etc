# Stage 5: Products Page (List + Filters)

## Checklist

- [x] Build filter sidebar (category, size, color, price range)
- [x] Build product grid using `ProductCard`
- [x] Connect filters to URL search params
- [x] Fetch products from `GET /api/products` with filter query params
- [x] Add sort dropdown (price low-high, price high-low, rating)
- [x] Add search bar for text search
- [x] Show product count and active filters summary
- [x] Verify desktop layout looks good (desktop-only, no responsive needed)
- [x] Add loading state with spinner

## Details

### 5.1 Page Layout

Two-column layout on desktop:

```
┌──────────┬──────────────────────────┐
│ Filters  │  Search + Sort bar       │
│ Sidebar  │  ────────────────────    │
│          │  Product Grid            │
│          │  (3 columns)             │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

Desktop-only layout. Filters always visible in the sidebar.

### 5.2 Filter Sidebar (`src/components/FilterSidebar.tsx`)

Uses existing shadcn components:

- **checkbox** — for category multi-select (Men, Women, Unisex)
- **checkbox** — for size multi-select (S, M, L, XL)
- **checkbox** — for color multi-select (show color name + small swatch)
- **input** — min price and max price fields (type="number")
- **button** — "Clear All" to reset filters
- **separator** — between filter sections

Each filter section has a heading and is collapsible.

### 5.3 URL-Driven Filters

All filter state is reflected in URL search params so links can be shared:

```
/products?category=men&size=L&color=Black&minPrice=1000&maxPrice=5000&sort=price-asc&search=graphic
```

- On page load, parse URL params and set initial filter state
- On filter change, update URL params (using `useSearchParams` from React Router)
- Fetch products whenever params change (debounce price inputs)

### 5.4 Search + Sort Bar

Row above the product grid:

- **input** — search field with placeholder "Search t-shirts..." (left)
- **native-select** — sort dropdown (right): "Price: Low to High", "Price: High to Low", "Highest Rated"
- Product count text: "Showing 8 of 12 products"

### 5.5 Product Grid

- Renders `ProductCard` for each product
- Shows **spinner** while loading
- Shows "No products found" message with a "Clear Filters" button when empty

### 5.6 Active Filters Display

Below the search bar, show a row of **badge** components for each active filter with an "x" to remove it. Example: `[Men ×] [Size: L ×] [$10–$50 ×]`
