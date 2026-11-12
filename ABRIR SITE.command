#!/bin/zsh
cd -- "${0:A:h}"
python3 - <<'PY'
import http.server
import socket
import subprocess
import threading
import urllib.request
from pathlib import Path
root = Path.cwd()
port = 8765
try:
    with urllib.request.urlopen('http://localhost:8765/', timeout=2) as response:
        existing = response.read().decode('utf-8', errors='replace')
    if 'ZACX' not in existing and 'Zacx' not in existing:
        raise RuntimeError('Porta ocupada por outro site')
except Exception:
    class LocalServer(http.server.ThreadingHTTPServer):
        allow_reuse_address = True
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(*args, directory=str(root), **kwargs)
    try:
        server = LocalServer(('127.0.0.1', port), handler)
    except OSError:
        server = LocalServer(('127.0.0.1', 0), handler)
    port = server.server_port
    subprocess.Popen(['open', 'http://localhost:%s/#tour-360' % port])
    print('Site aberto. Mantenha esta janela aberta enquanto usa a prévia.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
else:
    subprocess.Popen(['open', 'http://localhost:%s/#tour-360' % port])
PY
