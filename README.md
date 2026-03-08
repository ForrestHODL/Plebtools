# Plebtools

Plebtools is a collection of Bitcoin-first treasury utilities, calculators, and educational guides. The project ships as a Flask application that serves static HTML tools backed by a lightweight SQLite database for optional account storage.

---

## Quick Start

### Prerequisites

- Python 3.10 or newer
- `pip` (bundled with Python)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ForrestHODL/Plebtools.git
cd Plebtools
```

### 2. Create and Activate a Virtual Environment (Recommended)

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment (Optional)

Copy `env.production` to `.env` (or export variables manually) if you need to set:

```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///data/plebtools.db
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
```

> The project defaults to a local SQLite database and prints verification tokens to the console if email settings are absent.

### 5. Run the Development Server

```bash
python app.py
```

The site will be available at http://localhost:5000/. Key entry points include:

- `/home` – marketing landing page
- `/interest-arbitrage-calculator` – yield arbitrage calculator
- `/step-by-step-to-self-custody` – interactive self-custody guide

Static assets (HTML/CSS/JS) live at the repository root, so any edits are reflected immediately without rebuilding.

---

## Project Structure

```
app.py                       # Flask application and API routes
home.html                    # Default landing page
interest-arbitrage-calculator.html
step-by-step-to-self-custody.html
styles.css                   # Shared styling
requirements.txt             # Python dependencies
start_server.py              # Optional helper for production deployment
```

- All calculator & guide views are standalone HTML files served directly by Flask.
- User data for trackers (portfolio, covered calls, etc.) is persisted in `instance/plebtools.db` through SQLAlchemy models defined in `app.py`.

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

- Load `http://localhost:5000/home` in both light and dark theme modes.
- Navigate via the Tools dropdown to confirm every link resolves (no 404s).
- Verify calculators plot correctly after editing JS or CSS.
- For Flask changes, exercise the relevant API endpoints with cURL or Postman; confirm the SQLite database updates.
- When editing the self-custody guide, run through all quiz steps to ensure progression logic still unlocks properly.

---

## Deployment Notes

- The app is designed to run on any WSGI-compatible host (Gunicorn, uWSGI). For shared hosting (e.g., cPanel), see `cpanel_deployment_guide.md` for step-by-step instructions.
- Static files are versionless; leverage cache-busting (query strings) when updating critical assets (e.g., `styles.css?v=3`).

---

## Community

Plebtools is built by and for Bitcoin plebs. If you ship an improvement, share it on Nostr or Twitter, hop into the Telegram dev room, or reach out via the site’s donation/1:1 coaching links. Sats donations fuel ongoing development, bug fixes, and new tools for the community.

⚡ Donate: https://coinos.io/plebtools  
💬 Dev chat: https://t.me/+ybza8iAs5X9kZWMx

Thanks for helping Bitcoiners take custody of their data and their sats.
*** End Patch

