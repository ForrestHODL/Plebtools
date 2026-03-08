# Plebtools

Plebtools is a collection of Bitcoin-first treasury utilities, calculators, and educational guides. The project is **static HTML/CSS/JS**. No backend, no accounts. Data is stored locally in your browser.

---

## Quick Start

### Option 1: Open directly

Open `home.html` (or `index.html`, which redirects to home) in your browser. All tools work offline with no server.

### Option 2: Local static server (optional)

To avoid CORS issues when editing, serve the folder with any static server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .

# Then open http://localhost:8000/home.html
```

No database, environment variables, or dependencies required.

---

## Project Structure

```
home.html                    # Landing page
index.html                   # Redirects to home
treasury.html                # Treasury tracker
btc-buy-tracker.html         # Portfolio tracker
coveredcall-tracker.html      # Covered call tracker
compound-interest-calculator.html
retirement-calculator.html
the-great-intersection.html
btc-loan-ltv.html
financial-planner.html
bitcoin-security.html
pleb-release.html
interest-arbitrage-calculator.html
step-by-step-to-self-custody.html
invoice-builder.html
forrest-portfolio.html
privacy-analyzer.html
styles.css                   # Shared styling
images/                      # Logos and assets
data/                        # Optional: strategy chart data (JSON)
```

All tools are standalone HTML files. Data is stored in the browser (localStorage); nothing is sent to a server.

---

## Contributing

We welcome Bitcoiners who want to improve the tools, expand educational material, or refine UX. To contribute:

1. **Fork** the repository to your GitHub account.
2. **Create a feature branch** from the latest `main` (e.g., `feature/my-update`).
3. **Make your changes**:
   - Follow existing HTML/CSS patterns (BEM-style classes + CSS variables).
   - Keep assets lightweight and Bitcoin-focused.
   - Use U.S. English and BTC-first terminology.
4. **Run through the tools locally** and confirm you haven’t introduced console errors or broken navigation.
5. **Commit with descriptive messages** and push your branch.
6. **Open a Pull Request** back to `main`, describing the motivation, screenshots (if UI-facing), and any manual test notes.

We review PRs with a focus on:

- Clear UX that mirrors the existing design language.
- Accessibility considerations (contrast, keyboard navigation).
- Bitcoin-only ethos (no altcoin terminology or casino language).
- Minimal dependencies and simple deployment.

If you’re unsure about large features, please open an issue first to align on scope.

---

## Manual Testing Checklist

- Load the home page in both light and dark theme modes (where supported).
- Navigate via the Tools dropdown to confirm every link resolves (no 404s).
- Verify calculators and charts work after editing JS or CSS.
- When editing the self-custody guide, run through all quiz steps to ensure progression logic still unlocks properly.

---

## Deployment

Upload the repository contents to any static host (GitHub Pages, Netlify, cPanel static hosting, S3, etc.). No server-side runtime is required. See `cpanel_deployment_guide.md` for cPanel static deployment steps.

Static files use cache-busting query strings where needed (e.g., `styles.css?v=3`).

---

## Community

Plebtools is built by and for Bitcoin plebs. If you ship an improvement, share it on Nostr or Twitter, hop into the Telegram dev room, or reach out via the site’s donation/1:1 coaching links. Sats donations fuel ongoing development, bug fixes, and new tools for the community.

⚡ Donate: https://coinos.io/plebtools  
💬 Dev chat: https://t.me/+ybza8iAs5X9kZWMx

Thanks for helping Bitcoiners take custody of their data and their sats.
