# Plebtools - Bitcoin Tracking Tools

Open source Bitcoin tracking tools with account system and data sync.

## 🚀 Quick Start

### Option 1: Auto Setup (Recommended)
```bash
python setup.py
python start_server.py
```

### Option 2: Manual Setup
```bash
# Copy environment template
cp env.production .env

# Edit .env with your settings (optional)
# Install dependencies
pip install -r requirements.txt

# Start server
python start_server.py
```

## 📁 File Structure

```
plebtools/
├── 📄 HTML Pages
│   ├── home.html              # Home page
│   ├── account.html           # Account management
│   ├── btc-buy-tracker.html   # Bitcoin tracker
│   └── coveredcall-tracker.html # Covered call tracker
│
├── 🐍 Backend
│   ├── app.py                 # Flask server
│   ├── start_server.py        # Server startup
│   └── setup.py              # Auto setup script
│
├── ⚙️ Configuration
│   ├── .htaccess             # URL routing
│   ├── env.production        # Environment template
│   ├── .env                  # Your settings (created by setup)
│   └── requirements.txt      # Python dependencies
│
├── 📊 Data Storage
│   └── data/                 # Database storage
│       └── plebtools.db      # SQLite database (auto-created)
│
└── 🎨 Assets
    ├── styles.css            # Styling
    └── images/               # Images
```

## 🔧 Environment Files

### What You Need:
- **`.env`** - Your actual configuration (created by setup)
- **`env.production`** - Template file (keep this)

### What You DON'T Need:
- ~~`env.example`~~ - Removed (redundant)

## 🌐 cPanel Deployment

1. Upload all files to `public_html`
2. Create `data/` folder with 755 permissions
3. Rename `env.production` to `.env`
4. Your site is ready!

## ✨ Features

- **Dual Storage**: Local + Database
- **Account System**: Cross-device sync
- **Clean URLs**: No .html extensions
- **Responsive**: Works on all devices
- **Offline Ready**: Works without backend

## 🛠️ Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run setup
python setup.py

# Start development server
python start_server.py
```

## 📝 Configuration

Edit `.env` file to customize:
- Database settings
- Email configuration
- Secret keys

## 🎯 No More File Confusion!

- ✅ **One environment file** (`.env`)
- ✅ **One template** (`env.production`)
- ✅ **Auto-setup script** (`setup.py`)
- ✅ **Clean file structure**
