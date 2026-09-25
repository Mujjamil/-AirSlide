#!/usr/bin/env python3
"""
Simple HTTP server with Cross-Origin headers required for MediaPipe WASM
(SharedArrayBuffer needs COOP + COEP headers).
"""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

class COEPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress request logs for cleaner output
        pass

print(f"🖐  GestureSlides server running at http://localhost:{PORT}")
print("   Open that URL in Chrome/Firefox for full gesture support.")
print("   Press Ctrl+C to stop.\n")

httpd = http.server.HTTPServer(('', PORT), COEPHandler)
httpd.serve_forever()
