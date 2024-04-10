import mimetypes
from flask import Flask, send_file

app = Flask(__name__)

@app.route('/<path:filename>')
def send_static(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    if str(filename).endswith(".js"):
        mime_type="application/javascript"
    return send_file(filename, mimetype=mime_type)