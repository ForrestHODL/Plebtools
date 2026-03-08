# Plebtools updates: static-only, copy, and cleanup

Summary of changes made to remove accounts, clarify messaging, and de-emphasize AI-style copy across the site.

---

## 1. Remove everything account-related

### Backend and config removed
- **Deleted:** `app.py` (Flask app with users, auth, SQLite, API routes for btc-purchases, wallet-addresses, covered-call-trades).
- **Deleted:** `start_server.py` (server startup script).
- **Deleted:** `setup.py` (env/DB setup).
- **Deleted:** `env.production` (backend env template).

### Frontend (already done before this doc)
- **Deleted:** `account.html`.
- **Nav:** Removed the Account link from every page.
- **btc-buy-tracker.html:** Removed account modal CSS/JS and all server-sync code (`isLoggedIn`, `backendAvailable`, `apiCall`, sync to `/btc-purchases`, `/wallet-addresses`). Tracker is localStorage-only.
- **coveredcall-tracker.html:** Already localStorage-only; no account/API code.

### Docs updated
- **README.md:** Rewritten for static-only: open HTML or use a static server; no Python/Flask/DB; project structure and deployment updated.
- **cpanel_deployment_guide.md:** Rewritten for static deployment (upload HTML/CSS/assets, optional `.htaccess`); no app.py, Python app, database, or API.

### Left as-is
- **`.htaccess`:** Kept for static URL rewrites and security/cache headers (no API routing).
- **`data/README.md`:** Still documents optional `strategy-purchases.json` for The Great Intersection (chart data only).

---

## 2. Home page: open-source and privacy messaging

### Hero and meta
- **Subtitle:** Now states that Plebtools is “Open-source tools for charting Bitcoin, understanding the network, recording your treasury, and more.”
- **Privacy line:** Added under the subtitle: “Your data never leaves your device. No accounts, no servers. Everything stays in your browser and stays private.”
- **Meta and OG:** Title and descriptions updated to “Open-Source Bitcoin Tools” and to mention data staying in the browser / private.

---

## 3. Remove emojis and em dashes

### Em dashes (—)
- **home.html:** Replaced with periods or sentence breaks (“browser. No accounts”, “device. No accounts”).
- **step-by-step-to-self-custody.html:** All em dashes replaced with “ - ”.
- **invoice-builder.html:** Prose “—” replaced; placeholder “—” in invoice preview/JS replaced with “-”.
- **interest-arbitrage-calculator.html:** All placeholder “—” replaced with “-”.
- **README.md:** “static HTML/CSS/JS—no backend” → “static HTML/CSS/JS. No backend.”

### Emojis
- **All HTML files:** Removed emoji characters site-wide (e.g. from nav links, feature cards, theme toggles).
- **Nav:** Tools dropdown links are text-only (Treasury, Portfolio, Covered Calls, etc.) with no leading icons.
- **Home feature cards:** `<span class="feature-icon">` contents cleared (no chart/briefcase/lock etc.).
- **Theme toggles:** Replaced sun/moon (or similar) with the words “Light” and “Dark” where applicable (interest-arbitrage-calculator, invoice-builder, the-great-intersection, treasury).
- **Dropdown arrow:** Removed “▼” next to “Tools” on all pages so the button is just “Tools” with an empty arrow span.

---

## 4. Deep lookover / fixes

- **btc-buy-tracker.html:** Removed leftover server-sync blocks that referenced undefined `isLoggedIn` / `backendAvailable` / `apiCall` (would have thrown in the console).
- **home.html:** Fixed corrupted replacement characters before “Portfolio” and “Covered Calls” in the Tools dropdown so the labels display correctly.

---

## Result

- **Static-only:** No backend, no accounts, no API; all data in the browser (localStorage).
- **Clear messaging:** Home explains open-source purpose and that user data is private and stays on-device.
- **Neutral tone:** No emojis, no em dashes; plain text and simple punctuation throughout.
