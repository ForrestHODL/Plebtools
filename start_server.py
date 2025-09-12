#!/usr/bin/env python3
"""
Simple startup script for the Plebtools backend server
"""
import os
import sys
from app import app, db

def main():
    print("🚀 Starting Plebtools Backend Server...")
    print("=" * 50)
    
    # Check if database exists, create if not
    with app.app_context():
        db.create_all()
        print("✅ Database initialized")
    
    # Set default environment variables if not set
    if not os.environ.get('SECRET_KEY'):
        import secrets
        os.environ['SECRET_KEY'] = secrets.token_hex(32)
        print("🔑 Generated new secret key")
    
    if not os.environ.get('DATABASE_URL'):
        os.environ['DATABASE_URL'] = 'sqlite:///plebtools.db'
        print("💾 Using SQLite database: plebtools.db")
    
    print("\n📡 Server will be available at:")
    print("   http://localhost:5000")
    print("   http://127.0.0.1:5000")
    print("\n🔗 API endpoints:")
    print("   http://localhost:5000/api/user")
    print("   http://localhost:5000/api/btc-purchases")
    print("   http://localhost:5000/api/wallet-addresses")
    print("\n" + "=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()
