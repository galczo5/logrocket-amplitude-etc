# T-Shirt Shop

A demo e-commerce application built to showcase user monitoring and analytics integrations. It simulates a real t-shirt shop — with product listings, a cart, checkout, and user authentication — but all data is mocked and no real transactions take place.

## What This App Demonstrates

- **Session replay** — Record and replay user sessions to understand real behavior (e.g. LogRocket)
- **Event tracking** — Capture user interactions and build funnels (e.g. Amplitude)
- **User identification** — Associate analytics events with logged-in users
- **Conversion analytics** — Measure drop-off across the checkout funnel

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React 19 + TypeScript + Vite |
| Styling  | Tailwind CSS v4 + shadcn/ui  |
| Routing  | React Router v7              |
| Backend  | Express 5 (in-memory data)   |

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the frontend (Vite dev server on port 5173):

```bash
yarn dev
```

Start the backend (Express API on port 3001):

```bash
yarn server
```

## Scripts

| Script                | Description                          |
| --------------------- | ------------------------------------ |
| `yarn dev`            | Start the Vite dev server            |
| `yarn build`          | Type-check and build for production  |
| `yarn preview`        | Preview the production build         |
| `yarn server`         | Start the Express backend            |
| `yarn lint`           | Run ESLint                           |
| `yarn format`         | Format all files with Prettier       |
| `yarn format:check`   | Check formatting without writing     |

## Important Notes

- All product data is mocked — no real inventory exists
- Login accepts any email and password (no real authentication)
- No real payments are processed
- Data resets on every server restart
