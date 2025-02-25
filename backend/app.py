from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from scipy.stats import zscore

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    print("Flask is running")
    return "Flask is running!", 200

def clean_data(df):
    """ Cleans the dataset by removing NaN values, keeping only numeric columns, and normalizing. """
    df = df.dropna()  # Remove missing values
    df = df.select_dtypes(include=["number"])  # Keep only numeric columns
    df = df.apply(zscore)  # Normalize data using Z-score
    return df

def detect_anomalies(df, algorithm):
    """ Applies anomaly detection based on the selected algorithm. """
    if df.empty:
        return []

    feature_column = df.columns[4]  # Assuming first column is packet size

    if algorithm == "isolation_forest":
        model = IsolationForest(contamination=0.05, random_state=42)
        df["anomaly"] = model.fit_predict(df[[feature_column]])

    elif algorithm == "z_score":
        df["anomaly"] = df[feature_column].apply(lambda x: 1 if abs(x) > 3 else -1)

    else:
        return []

    anomalies = df[df["anomaly"] == -1]
    return anomalies[[feature_column]].to_dict(orient="records")

@app.route('/upload', methods=['POST'])
def upload_file():
    """ Handles file upload, cleans data, applies selected anomaly detection, and returns results. """
    if "file" not in request.files or "algorithm" not in request.form:
        return jsonify({"message": "Missing file or algorithm"}), 400

    file = request.files["file"]
    algorithm = request.form["algorithm"]

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)
    print(f"File saved at: {file_path}")

    # Process dataset
    try:
        df = pd.read_csv(file_path)
        df = clean_data(df)
        anomalies = detect_anomalies(df, algorithm)

        return jsonify({
            "message": f"File '{file.filename}' uploaded successfully!",
            "anomalies": anomalies
        })

    except Exception as e:
        return jsonify({"message": f"Error processing file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
