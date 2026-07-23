import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory


BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__, static_folder=None)


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "长期计划.html")


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.get("/<path:filename>")
def prototype_file(filename: str):
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "8000")),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
