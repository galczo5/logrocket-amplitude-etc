# Stage 2: Backend API (Express + Mocked Data)

## Checklist

- [x] Create Express server entry point (`server/index.ts`)
- [x] Create mocked product data (`server/data/products.ts`)
- [x] Create mocked user data (`server/data/users.ts`)
- [x] Implement `GET /api/products` endpoint (with query params for filtering)
- [x] Implement `GET /api/products/:id` endpoint
- [x] Implement `POST /api/auth/login` endpoint
- [x] Implement `POST /api/orders` endpoint
- [x] Add a dev script to run the server with `tsx`
- [x] Test all endpoints manually or with curl

## Details

### 2.1 Server Entry Point (`server/index.ts`)

- Express 5 app listening on port `3001`
- JSON body parsing middleware
- CORS middleware (for dev convenience)
- All routes prefixed with `/api`

### 2.2 Mocked Data

**`server/data/products.ts`** — Array of ~12 t-shirt products:

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents (e.g. 2999 = $29.99)
  image: string; // placeholder path, will be replaced later
  category: string; // "men" | "women" | "unisex"
  sizes: string[]; // ["S", "M", "L", "XL"]
  colors: Color[];
  featured: boolean;
  rating: number; // 1-5
  reviewCount: number;
}

interface Color {
  name: string; // "Black", "White", etc.
  hex: string; // "#000000"
}
```

Include a variety: graphic tees, plain tees, polos, v-necks. Mix of categories, sizes, and colors. Set `image` to `https://placehold.co/400x600.png` for all products — this will be replaced with real images later.

**`server/data/users.ts`** — Single default mock user object returned on any login:

```ts
const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: null
};
```

### 2.3 API Endpoints

| Method | Path                | Description                                                                                                                                           |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/products`     | List all products. Supports query params: `category`, `size`, `color`, `minPrice`, `maxPrice`, `sort` (`price-asc`, `price-desc`, `rating`), `search` |
| `GET`  | `/api/products/:id` | Get single product by ID. Returns 404 if not found                                                                                                    |
| `POST` | `/api/auth/login`   | Accepts `{ email, password }`. Always returns `{ user, token: "mock-jwt-token" }` regardless of credentials                                           |
| `POST` | `/api/orders`       | Accepts order payload `{ items, shipping, payment }`. Returns `{ orderId, status: "confirmed" }` with a generated order ID                            |

### 2.4 Filtering Logic (`GET /api/products`)

Filter the in-memory array based on query params:

1. `category` — exact match on `product.category`
2. `size` — product must include the size in its `sizes` array
3. `color` — product must have a color with matching name (case-insensitive)
4. `minPrice` / `maxPrice` — range filter on `product.price`
5. `search` — case-insensitive substring match on `product.name` or `product.description`
6. `sort` — sort the filtered results accordingly

Return: `{ products: Product[], total: number }`

### 2.5 Dev Script

Install `tsx` as a dev dependency and add a script to `package.json`:

```json
{
  "scripts": {
    "server": "tsx watch server/index.ts"
  }
}
```

This gives hot-reload during development.
