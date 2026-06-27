import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/healthz":
            body = b"ok\n"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path == "/":
            self.path = "/index.html"

        return super().do_GET()


def main():
    host = os.environ.get("STOCK_BOARD_HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "4173"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving solar system observatory on http://{host}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
