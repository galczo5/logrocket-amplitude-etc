# Environment Variables Setup Guide

This guide explains how to set up environment variables for the analytics services (Amplitude, LogRocket, and Hotjar).

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys and IDs (see instructions below)

3. The `.env` file is automatically loaded by Vite during development

4. **IMPORTANT:** Never commit `.env` to git — it contains secrets!

## What is `.env`?

- A local file that stores environment-specific configuration (API keys, secrets, etc.)
- Automatically loaded by Vite during `yarn dev`
- **Should never be committed to version control** (it's in `.gitignore`)
- Each developer has their own `.env` file with their own keys

## What is `.env.example`?

- A template file that shows what environment variables are needed
- Safe to commit to git (contains no real secrets)
- Acts as documentation for new developers
- Always keep this file updated when adding new environment variables

## Getting Your API Keys

### 1. Amplitude Analytics

**What it does:** Tracks user events, funnels, and product analytics

**Steps to get API Key:**

1. Go to [https://analytics.amplitude.com](https://analytics.amplitude.com)
2. Sign up or log in
3. Create a new project (or select existing)
4. Go to **Project Settings** (gear icon in bottom left)
5. Copy the **API Key** from the settings page
6. Paste it in `.env`:
   ```
   VITE_AMPLITUDE_API_KEY=abc123def456...
   ```

**Docs:** [Amplitude Documentation](https://amplitude.com/docs)

---

### 2. LogRocket

**What it does:** Records user sessions, captures console logs, network activity, and errors

**Steps to get App ID:**

1. Go to [https://app.logrocket.com](https://app.logrocket.com)
2. Sign up or log in
3. Create a new project
4. In **Settings → Organization → Projects**, find your project
5. Copy the **App ID** (looks like: `abc123/production`)
6. Paste it in `.env`:
   ```
   VITE_LOGROCKET_APP_ID=abc123/production
   ```

**Docs:** [LogRocket Documentation](https://docs.logrocket.com)

---

### 3. Hotjar

**What it does:** Records user sessions, heatmaps, feedback, and form analytics

**Steps to get Site ID:**

1. Go to [https://app.hotjar.com](https://app.hotjar.com)
2. Sign up or log in
3. Create a new site (or select existing)
4. Go to **Settings → Site Configuration** or **Tracking Code**
5. Find the **Site ID** in the code snippet:
   ```javascript
   hj('site', XXXXX);  // <- This is your Site ID
   ```
6. Paste it in `.env`:
   ```
   VITE_HOTJAR_SITE_ID=123456
   ```

**Docs:** [Hotjar Setup Guide](https://help.hotjar.com/hc/en-us)

---

## Your `.env` File

After filling in all keys, your `.env` should look like:

```env
# Analytics Services Configuration
# Copy this file to .env and fill in your actual API keys/IDs
# See ENV_SETUP.md for detailed instructions on how to obtain these keys

# Amplitude - Product Analytics
VITE_AMPLITUDE_API_KEY=abc123def456ghi789jkl012mno345pqr

# LogRocket - Session Replay & Error Tracking
VITE_LOGROCKET_APP_ID=xyz789/production

# Hotjar - Heatmaps & User Feedback
VITE_HOTJAR_SITE_ID=987654
```

## How Environment Variables Work

### Development (Local Machine)

- Vite loads `.env` automatically when you run `yarn dev`
- Environment variables are available in your code as `import.meta.env.VITE_*`

Example in code:
```typescript
const amplitudeKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
```

### Production (Deployment)

- `.env` file is not deployed (it's in `.gitignore`)
- Instead, set environment variables in your deployment platform:
  - **Vercel/Netlify:** Set them in project settings → environment variables
  - **Docker:** Pass as build arguments or runtime environment variables
  - **Server:** Set as system environment variables

### Important: VITE_ Prefix

- All variables must start with `VITE_` to be accessible in the browser
- This is a Vite requirement for security (prevents accidental exposure)
- Non-prefixed variables are only available in Node.js (server code)

## Development Workflow

### First Time Setup

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Get your API keys (see instructions above)
# 3. Fill in .env with your keys

# 4. Start development server
yarn dev

# 5. Open browser console
# 6. You should see no initialization errors
```

### For Each New Feature

- If you add a new analytics service or API key:
  1. Add it to `.env.example` with a placeholder
  2. Add instructions here in `ENV_SETUP.md`
  3. Ask your team to update their local `.env`

## Troubleshooting

### "Environment variable is undefined"
- Ensure the variable is in `.env` (not `.env.example`)
- Check the name matches exactly (including `VITE_` prefix)
- Restart the dev server after adding new variables

### "Blank/missing API key in production"
- Set environment variables in your deployment platform
- The `.env` file is not deployed (by design, for security)

### "I accidentally committed .env to git"
1. Remove it from git history:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from version control"
   ```
2. Invalidate any exposed keys in the service dashboards
3. Generate new keys and update your local `.env`

### "I don't have API keys yet"
- Create free accounts on [Amplitude](https://amplitude.com), [LogRocket](https://logrocket.com), and [Hotjar](https://hotjar.com)
- You can use placeholder values or empty strings during development
- The app will work without them (services just won't initialize)

## Security Notes

- **Never commit `.env` to git** — it contains secrets
- **Never paste `.env` in chat, emails, or anywhere public**
- **Rotate keys periodically** in production
- **Use different keys for staging/production** if possible
- Always use HTTPS in production (required by some services)

## Next Steps

Once you've set up your `.env`:

1. Start the development server: `yarn dev`
2. Check browser console for any initialization errors
3. Navigate through the app and verify analytics are being collected
4. See `docs/12-analytics-integration.md` for implementation details
