# Plebtools cPanel Deployment Guide

## 🚀 Quick Setup for cPanel Storage

I've configured everything for you! Here's what I've set up and what you need to do:

### ✅ What I've Done For You

1. **Updated app.py** - Now uses SQLite database in `data/` folder
2. **Created .htaccess** - Enables API routing on cPanel
3. **Updated API URLs** - Both trackers now use relative URLs (`/api`)
4. **Created env.production** - Environment configuration file
5. **Added data directory creation** - Automatically creates storage folder

### 📁 Files You Need to Upload to cPanel

Upload these files to your cPanel `public_html` directory:

```
public_html/
├── btc-buy-tracker.html
├── coveredcall-tracker.html
├── home.html
├── account.html
├── styles.css
├── app.py
├── requirements.txt
├── .htaccess
├── env.production
├── setup.py (optional)
└── data/ (create this folder with 755 permissions)
```

### 🔧 cPanel Setup Steps

#### 1. Create Data Directory
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Create a new folder called `data`
5. Set permissions to **755**

#### 2. Upload Files
1. Upload all the files listed above
2. Make sure `.htaccess` is uploaded (it starts with a dot)
3. Upload `env.production` and rename it to `.env`
4. **OR** run `python setup.py` to auto-configure

#### 3. Set Python App (if available)
1. Go to **Python App** in cPanel
2. Create a new Python app
3. Set the app directory to your project folder
4. Set the startup file to `app.py`
5. Install requirements: `pip install -r requirements.txt`

#### 4. Alternative: Use CGI (if Python App not available)
1. Make `app.py` executable: `chmod +x app.py`
2. Add this shebang line to the top of `app.py`:
   ```python
   #!/usr/bin/env python3
   ```

### 🎯 How It Works

#### **Data Storage**
- **Database**: SQLite file stored in `data/plebtools.db`
- **Automatic**: Database is created when first user registers
- **Persistent**: Data survives server restarts
- **Secure**: Database file is protected by .htaccess

#### **API Routing**
- **URL**: `https://yourdomain.com/api/endpoint`
- **Handled by**: .htaccess routes to app.py
- **CORS**: Configured for cross-origin requests

#### **User Experience**
- **Anonymous**: Data stored in browser localStorage
- **Registered**: Data synced to database + localStorage
- **Cross-device**: Access data from any device when logged in

### 🔒 Security Features

- **Protected Files**: .env and database files are not accessible via web
- **CORS Headers**: Proper cross-origin request handling
- **Security Headers**: XSS protection, content type validation
- **Password Hashing**: Secure password storage

### 📊 Database Schema

The system automatically creates these tables:
- **users** - User accounts and authentication
- **btc_purchases** - Bitcoin purchase data
- **wallet_addresses** - Bitcoin wallet addresses
- **covered_call_trades** - Covered call trade data

### 🎉 What Users Get

#### **Without Account (Anonymous)**
- ✅ Add/edit/delete Bitcoin purchases
- ✅ Add/remove wallet addresses
- ✅ Add/edit/delete covered call trades
- ✅ Export data to CSV
- ✅ All data stored locally in browser

#### **With Account (Registered)**
- ✅ Everything above PLUS:
- ✅ Cross-device data access
- ✅ Data backup in database
- ✅ Data survives browser clearing
- ✅ Email verification (if configured)

### 🛠️ Troubleshooting

#### **If API doesn't work:**
1. Check .htaccess is uploaded correctly
2. Verify data folder has 755 permissions
3. Check cPanel error logs

#### **If database doesn't work:**
1. Ensure data folder exists and is writable
2. Check file permissions (755 for folder, 644 for files)
3. Verify .env file is uploaded

#### **If Python doesn't work:**
1. Check Python version (3.7+ required)
2. Install requirements: `pip install -r requirements.txt`
3. Check cPanel Python app configuration

### 📈 Next Steps

1. **Upload files to cPanel**
2. **Create data folder with 755 permissions**
3. **Test the tools on your domain**
4. **Optional: Configure email for account verification**

Your tools will work perfectly with both local storage and database storage! 🎉
