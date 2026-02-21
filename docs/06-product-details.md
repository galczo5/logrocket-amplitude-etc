# Stage 6: Product Details Page

## Checklist

- [x] Fetch product data from `GET /api/products/:id`
- [x] Build product image display (placeholder area)
- [x] Build product info section (name, price, rating, description)
- [x] Add size selector (toggle group)
- [x] Add color selector (clickable swatches)
- [x] Add "Add to Cart" button
- [x] Add breadcrumb navigation
- [x] Handle loading and 404 states
- [x] Verify desktop layout looks good (desktop-only, no responsive needed)

## Details

### 6.1 Page Layout

Two-column desktop layout:

```
┌─────────────────────┬─────────────────────┐
│                     │  Breadcrumb         │
│  Product Image      │  Product Name       │
│  (placeholder)      │  Price              │
│                     │  Rating + Reviews   │
│                     │  ─────────────      │
│                     │  Color: [swatches]  │
│                     │  Size:  [S M L XL]  │
│                     │  ─────────────      │
│                     │  [Add to Cart]      │
│                     │  ─────────────      │
│                     │  Description        │
└─────────────────────┴─────────────────────┘
```

### 6.2 Breadcrumb

Uses the **breadcrumb** component:

```
Home > Products > {Product Name}
```

Each segment is a link except the current product name.

### 6.3 Product Image Area

- Display product image using the `image` URL from the product data (`https://placehold.co/400x600.png`)
- Large display area (aspect-ratio ~2:3 matching the placeholder dimensions)
- Will be replaced with actual product images later

### 6.4 Product Info

- **Product name** — large heading
- **Price** — formatted as `$XX.XX`, prominent styling
- **Rating** — star display + review count text (e.g., "4.5 out of 5 (128 reviews)")
- **badge** — category label (Men / Women / Unisex)

### 6.5 Size Selector

Row of **toggle** buttons for each available size (from `product.sizes`):

- Only one size can be selected at a time
- Selected state styled with primary color
- Required before adding to cart — show validation message if not selected

### 6.6 Color Selector

Row of circular color swatches (styled divs matching `color.hex`):

- Click to select
- Selected swatch gets a ring/border
- Show color name below the swatches
- Required before adding to cart

### 6.7 Add to Cart

- **button** — "Add to Cart"
- Disabled until both size and color are selected
- On click: adds the item to cart context (built in Stage 7)
- Shows a brief success **alert** or tooltip after adding

### 6.8 Error / Loading States

- **spinner** while fetching product data
- If product not found (404): show a message with a button to go back to products
