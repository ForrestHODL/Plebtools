# Plebtools cPanel Deployment Guide (Static)

Plebtools is a **static site**. No Python, no database, no API. Upload the files and serve them from cPanel’s document root.

---

## What to Upload

Upload the project files to your cPanel `public_html` (or your domain’s document root):

```
public_html/
├── index.html
├── home.html
├── treasury.html
├── btc-buy-tracker.html
├── coveredcall-tracker.html
├── compound-interest-calculator.html
├── retirement-calculator.html
├── the-great-intersection.html
├── btc-loan-ltv.html
├── financial-planner.html
├── bitcoin-security.html
├── pleb-release.html
├── interest-arbitrage-calculator.html
├── step-by-step-to-self-custody.html
├── invoice-builder.html
├── forrest-portfolio.html
├── privacy-analyzer.html
├── styles.css
├── .htaccess          (optional: clean URLs + security headers)
├── images/            (if you use any)
├── data/              (optional: JSON/data files for charts)
└── ... any other .html and assets
```

No `app.py`, `requirements.txt`, `env.production`, or `data/` database folder is needed.

---

## Optional: .htaccess

If you upload `.htaccess`, it will:

- Map clean URLs (e.g. `/forrest-portfolio` → `forrest-portfolio.html`)
- Add security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Set cache rules for static assets

If you don’t use it, links will still work using full filenames (e.g. `forrest-portfolio.html`).

---

## How It Works

- **No server runtime** – cPanel serves the HTML/CSS/JS files as static files.
- **No accounts** – All user data stays in the browser (localStorage).
- **No API** – There are no backend endpoints; the site is fully client-side.

---

## Troubleshooting

- **404s on links**  
  Make sure all referenced `.html` files and folders (e.g. `images/`, `data/`) are uploaded and paths match (case-sensitive on Linux).

- **Styles or scripts not loading**  
  Check that `styles.css` and any JS/assets are in the same directory (or correct subpaths) and that filenames match.

- **Clean URLs not working**  
  Ensure `.htaccess` is uploaded and that Apache `mod_rewrite` is enabled for your account (your host can confirm).

---

## Next Steps

1. Upload the static files to `public_html`.
2. Open your domain in a browser and click through the Tools menu to confirm every page loads.
3. Test a tool that uses localStorage (e.g. btc-buy-tracker) to confirm data is saved in the browser.

That’s it. No Python app, no database, no accounts.
