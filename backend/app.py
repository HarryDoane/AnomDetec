from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from any origin

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    print("flask is recived")
    return "Flask is running!", 200

@app.route ('/upload', methods=['POST'])
def upload_file():
    print("Request received!")

    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        print("No file selected")
        return jsonify({"message": "No file selected"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)  # Save the file

    print(f"File saved at: {file_path}")
    return jsonify({"message": f"File '{file.filename}' uploaded successfully!"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
