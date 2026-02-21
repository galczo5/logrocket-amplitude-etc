# Stage 10: About Page

## Checklist

- [ ] Create `AboutPage` component at `src/pages/AboutPage.tsx`
- [ ] Add `/about` route to the router
- [ ] Add "About" link to the site navigation header
- [ ] Build the page sections: intro, purpose, tech stack, monitoring tools

## Details

### 10.1 Purpose

This app is a demo t-shirt shop used to showcase user monitoring and analytics tools (e.g. LogRocket, Amplitude). The About page explains this context to anyone browsing the app — it makes it clear the shop is intentionally simple and exists as a realistic-enough e-commerce surface for demonstrating session replay, event tracking, and user analytics.

### 10.2 Page Layout

Single-column, centered, max-w-3xl:

```
┌────────────────────────────────────┐
│  About This App                    │  ← h1
│                                    │
│  [ Intro paragraph ]               │
│                                    │
│  What This App Demonstrates        │  ← h2
│  • Session replay (LogRocket)      │
│  • Event tracking (Amplitude)      │
│  • User identification             │
│  • Funnel & conversion analytics   │
│                                    │
│  Tech Stack                        │  ← h2
│  [ Table: layer → technology ]     │
│                                    │
│  Important Notes                   │  ← h2
│  [ Disclaimer bullets ]            │
└────────────────────────────────────┘
```

### 10.3 Content

**Intro paragraph:**

> This is a demo e-commerce application built to showcase user monitoring and analytics integrations. It simulates a real t-shirt shop — with product listings, a cart, checkout, and user authentication — but all data is mocked and no real transactions take place.

**"What This App Demonstrates" section:**

Bullet list:

- **Session replay** — record and replay user sessions to understand real behavior (e.g. LogRocket)
- **Event tracking** — capture user interactions and build funnels (e.g. Amplitude)
- **User identification** — associate analytics events with logged-in users
- **Conversion analytics** — measure drop-off across the checkout funnel

**Tech Stack table** (mirrors the overview):

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v7 |
| Backend | Express 5 (in-memory data) |

**"Important Notes" section:**

- All product data is mocked — no real inventory exists
- Login accepts any email and password (no real authentication)
- No real payments are processed
- Data resets on every server restart

### 10.4 Components Used

- **card** — wrap each content section
- **badge** — label tech stack entries (optional)
- **separator** — between sections

### 10.5 Route & Navigation

- Route: `/about`
- Add link to the main nav header alongside existing links
- No auth required — publicly accessible
