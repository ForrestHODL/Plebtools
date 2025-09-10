Plebtools

Plebtools is an open-source, lightweight web-based tool for tracking Bitcoin purchases. Built with HTML, CSS, and minimal Python, it offers a simple, effective frontend and backend for your Bitcoin budgeting needs.

Features

Bitcoin Purchase Tracking: Manage and visualize your BTC purchases with btc-buy-tracker.html.

Covered Call Tracking: Monitor BTC covered-call positions using coveredcall-tracker.html.

Treasury Overview: Maintain a high-level view of your BTC holdings with treasury.html.

Static and Interactive Views: HTML files provide clean, mobile-friendly dashboards.

Minimal Backend Logic: The server.py file manages data flows and serves pages dynamically.

Clean Design: Uses styles.css to ensure a sleek, responsive front-end experience.

Repository Structure
Plebtools/
├── btc-buy-tracker.html - Dashboard for Bitcoin purchase tracking
├── coveredcall-tracker.html - Covered-call performance view
├── treasury.html - Overview of total BTC holdings
├── home.html - Landing page
├── press-release.html - Informational or marketing content
├── styles.css - Shared stylesheet for UI consistency
├── server.py - Backend logic and routing
├── .htaccess - Server configuration (for Apache hosting)
├── images/ - Contains visual assets such as charts or icons
└── README.txt (this file) - Project documentation

Getting Started
Prerequisites:

Python 3.x installed

Web server (e.g. Apache, Nginx) or use a lightweight Python server

Installation and Usage:

Clone the repository:
git clone https://github.com/ForrestHODL/Plebtools.git

cd Plebtools

Serve locally using Python (for development):
python3 -m http.server 8000
Then open http://localhost:8000/home.html
 in your browser.

Using the backend server (server.py):
python3 server.py
This starts the app. Check the console or script comments for the listening port. Navigate to your browser to view the app in action.

Deploying on a Production Web Server:

Copy the contents of this repo to your server, ensuring styles.css, images, and HTML files are correctly referenced.

Place server.py behind a WSGI interface or configure Apache/Nginx to route dynamic requests to it.

Use .htaccess for directory rules or URL rewriting if needed.

How to Use

Track new BTC purchases: Update or input transactions into btc-buy-tracker.html.

Manage covered calls: Use the specialized tracker to monitor options.

View your treasury: Check the treasury.html summary for a clean overview.

Press and info page: The press-release.html can be used for introductory or external-facing content.

Contributions
Contributions are welcome. Whether it’s UI improvements, new tracker types, or features like authentication or CSV export, feel free to open an issue or submit a pull request.

License and Contact
Please refer to the repository’s license (if provided), or reach out to the maintainer for specifics.

Plebtools keeps Bitcoin portfolio tracking simple, transparent, and lightweight — no database needed, just clean code and straightforward functionality.
