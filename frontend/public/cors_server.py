from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/my_model/<path:filename>')
def serve_model(filename):
    return send_from_directory('my_model', filename)

@app.route('/')
def serve_html():
    return send_from_directory('', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
