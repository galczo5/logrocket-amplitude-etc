# T-Shirt Shop - Implementation Plan Overview

A simple online t-shirt shop with mocked data. No database — all data lives in memory on the Express server.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v7 |
| Backend | Express 5 (in `server/`) |
| Data | In-memory mocked JSON |

## Available shadcn/ui Components

alert, badge, breadcrumb, button, card, carousel, checkbox, dialog, drawer, input, item, label, native-select, navigation-menu, pagination, progress, separator, spinner, switch, table, tabs, textarea, toggle, tooltip

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, featured products, categories |
| Login | `/login` | Email + password form (accepts anything) |
| Products | `/products` | Product grid with filters (size, color, price) |
| Product Details | `/products/:id` | Single product view with size/color picker |
| Checkout | `/checkout` | Cart summary + shipping form |
| Payment | `/checkout/payment` | Payment form + order confirmation |

## Implementation Stages

| # | Stage | Doc |
|---|-------|-----|
| 1 | Project Setup & Routing | [01-setup.md](./01-setup.md) |
| 2 | Backend API | [02-backend.md](./02-backend.md) |
| 3 | Authentication | [03-auth.md](./03-auth.md) |
| 4 | Home Page | [04-home.md](./04-home.md) |
| 5 | Products Page | [05-products.md](./05-products.md) |
| 6 | Product Details Page | [06-product-details.md](./06-product-details.md) |
| 7 | Cart & Checkout | [07-checkout.md](./07-checkout.md) |
| 8 | Payment | [08-payment.md](./08-payment.md) |
