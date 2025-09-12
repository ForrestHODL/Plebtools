#!/usr/bin/env python3
"""
Plebtools Setup Script
This script helps you set up the environment for Plebtools
"""
import os
import secrets
import shutil

def main():
    print("🚀 Plebtools Setup")
    print("=" * 40)
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("✅ .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ").lower()
        if response != 'y':
            print("Setup cancelled.")
            return
    
    # Copy env.production to .env
    if os.path.exists('env.production'):
        shutil.copy('env.production', '.env')
        print("✅ Created .env file from template")
    else:
        print("❌ env.production template not found")
        return
    
    # Generate a random secret key
    secret_key = secrets.token_hex(32)
    
    # Update .env with the new secret key
    with open('.env', 'r') as f:
        content = f.read()
    
    content = content.replace('plebtools-secret-key-change-in-production', secret_key)
    
    with open('.env', 'w') as f:
        f.write(content)
    
    print(f"✅ Generated new secret key: {secret_key[:16]}...")
    
    # Create data directory
    os.makedirs('data', exist_ok=True)
    print("✅ Created data directory")
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Edit .env file if you want to configure email")
    print("2. Run: python start_server.py")
    print("3. Open your browser to the site")
    
    print("\n📝 Configuration files:")
    print("- .env (your settings)")
    print("- env.production (template)")
    print("- data/ (database storage)")

if __name__ == '__main__':
    main()
