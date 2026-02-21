# Stage 4: Home Page

## Checklist

- [x] Build hero banner section with CTA button
- [x] Build category cards section (Men, Women, Unisex)
- [x] Fetch and display featured products grid
- [x] Create reusable `ProductCard` component
- [x] Add "Shop Now" links that navigate to the products page with pre-applied filters
- [x] Verify desktop layout looks good (desktop-only, no responsive needed)

## Details

### 4.1 Hero Banner

Full-width section at the top of the page:

- Large heading: "Premium T-Shirts for Everyone"
- Subheading: "Discover our collection of comfortable, stylish tees"
- **button** — "Shop All" linking to `/products`
- Background: a solid color or gradient (no image needed for now — can be enhanced later)

### 4.2 Category Cards

Row of 3 **card** components, one per category:

| Card | Label | Link |
|------|-------|------|
| Men's Collection | "Men" | `/products?category=men` |
| Women's Collection | "Women" | `/products?category=women` |
| Unisex Collection | "Unisex" | `/products?category=unisex` |

Each card:
- Placeholder image area (colored background with the category name)
- Category name as card title
- Brief description
- Clickable — entire card links to the filtered products page

### 4.3 Featured Products

Section below categories:

- Heading: "Featured Products"
- Fetch from `GET /api/products?featured=true` (or filter client-side)
- Display up to 4 products in a 4-column grid
- Each product rendered with the `ProductCard` component

### 4.4 ProductCard Component (`src/components/ProductCard.tsx`)

Reusable card for displaying a product in grid/list views. Uses:

- **card** (CardHeader, CardContent, CardFooter)
- **badge** for category
- Product image using `https://placehold.co/400x600.png` (will be replaced with real images later)
- Product name
- Price formatted as `$XX.XX`
- Star rating display (text-based, e.g., "4.5 / 5")
- Available color swatches (small colored circles)
- Entire card is a link to `/products/:id`

This component will be reused on the Products page (Stage 5).
