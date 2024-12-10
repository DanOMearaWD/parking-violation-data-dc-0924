import http.server  # Import the module that provides basic HTTP server functionality
import socketserver  # Import the module to handle TCP connections for the server

PORT = 8000  # Define the port number the server will listen on

# Set up the TCPServer to serve files using the SimpleHTTPRequestHandler
# The handler automatically serves files from the current directory
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")  # Print a message indicating the server is running
    httpd.serve_forever()  # Start the server and keep it running indefinitely to handle requests
