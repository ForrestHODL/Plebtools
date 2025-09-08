#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If the path is just "/" or empty, serve home.html
        if path == "/" or path == "":
            self.path = "/home.html"
        
        # Handle specific routes
        elif path == "/btc-tracker" or path == "/btc-buy-tracker" or path == "/plebtools-btc":
            self.path = "/btc-buy-tracker.html"
        
        # Handle treasury tracker route
        elif path == "/treasury" or path == "/plebtools-treasury":
            self.path = "/forresthodl.html"
        
        # If the path doesn't have an extension and the file doesn't exist,
        # try adding .html extension
        elif not os.path.exists(path[1:]) and not os.path.splitext(path)[1]:
            if os.path.exists(path[1:] + ".html"):
                self.path = path + ".html"
        
        # Call the parent class method
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Plebtools Home: http://localhost:8000")
        print("Treasury Tracker: http://localhost:8000/treasury")
        print("BTC Tracker: http://localhost:8000/plebtools-btc")
        print("(No .html extension needed in the URL)")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
