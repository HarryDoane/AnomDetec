 # Import necessary libraries
from flask import Flask, request, jsonify #Flask for web app, request for handling file uploads
from flask_cors import CORS # Enables Cross-Origin resource sharing to allow frontend requests
import os # For handling file paths
import pandas as pd # For CSV data
import numpy as np # For numerical operations
from sklearn.ensemble import IsolationForest # Anom detection using Isolation Forest
from sklearn.neighbors import LocalOutlierFactor # Anom detection using Local Outlier
from scipy.stats import zscore # For data normalization and anomoly detection

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Allows any website to access the API (not ideal for security)
# Frontend and Backened run on different ports
# By default browsers block requests from one origin to another CORS allows requests to be sent

# Deine upload folder for CSV files
UPLOAD_FOLDER = "uploads" # Variable to store folder name
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # Creates a folder on system, if folder exits it doesnt throw an error
# Folder is used to store uploaded files
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER # Adds folder to flask configuration to be used when saving files

@app.route('/')
def home():
    """ A simple route to make sure server is running"""
    print("Flask is running") # log for debugging
    return "Flask is running!", 200 # Return succes response

@app.route('/columns', methods=['POST'])
def get_columns():
    """Extracts column names from the uploaded file"""
    if "file" not in request.files: # If doesnt file exists from frontend log error message
        print(" No file uploaded")
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["file"] # Get the uploaded file

    try:
        df = pd.read_csv(file) # Read the CSV file
        numeric_columns = df.select_dtypes(include=["number"]).columns.tolist() # Isolate or select only number columns
        
        print(f" Detected columns: {numeric_columns}")  # Debugging log
        
        return jsonify({"columns": numeric_columns})
    except Exception as e:
        print(f" Error processing file: {str(e)}")  # Debugging log
        return jsonify({"message": f"Error processing file: {str(e)}"}), 500
    # try - except catches the error rather then letting program crash and can log for debugging

def clean_data(df):
    """ Cleans the dataset by removing NaN values, keeping only numeric columns, and normalizing. """
    df = df.dropna()  # Remove missing values
    df = df.select_dtypes(include=["number"])  # Keep only numeric columns
    df = df.apply(zscore)  # Normalize data using Z-score
    return df

def detect_anomalies(df, column, algorithm):
    """ Applies anomaly detection based on the selected algorithm """
    if df.empty:
        return [] # Return empty list if df is empty

    if column not in df.columns: # Return empty list if coluimn doesnt exist
        return []
    # Uses isolation forest
    if algorithm == "isolation_forest":
        model = IsolationForest(contamination=0.05, random_state=42) # Define model with contamination level
        df["anomaly"] = model.fit_predict(df[[column]]) # Predicit anomalies
    # Apply Z-score 
    elif algorithm == "z_score":
        df["anomaly"] = df[column].apply(lambda x: 1 if abs(x) > 5 else -1) # Mark outliers beyond 5 standard deviations

    # Apply local outlier factor
    elif algorithm == "lof":
        lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05) # Define model
        df["anomaly"] = lof.fit_predict(df[[column]].values.reshape(-1,1)) # Predict



    else:
        return [] # Return if alogrithm unknown
    # Returns new df where only rows marked as -1 meaning anomanly are selected
    anomalies = df[df["anomaly"] == -1]
    print(f"Found {len(anomalies)} anomalies with {algorithm}")
    return anomalies[[column]].to_dict(orient="records")
    # Returns new data from as a "dictionary" rather than typical df
    # {"Packet Size": 1500},
    # {"Packet Size": 2000}
    # Regular pandes df can be sent as JSON to frontend

@app.route('/upload', methods=['POST'])
def upload_file():
    """ Handles file upload, cleans data, applies selected anomaly detection, and returns results """
    # Ensure that both file and algorithm are provided
    if "file" not in request.files or "algorithm" not in request.form:
        return jsonify({"message": "Missing file or algorithm"}), 400

    file = request.files["file"] # Get uploaded file
    algorithm = request.form["algorithm"] # Get selected file
    column = request.form["column"] # Get selected column

    if file.filename == "": # Throw error if no file selected
        return jsonify({"message": "No file selected"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename) # Define the file save path
    file.save(file_path) # Save uploaded file
    print(f"File saved at: {file_path}")

    # Process dataset that was uploaded
    try:
        df = pd.read_csv(file_path) # Read the CSV file
        df = clean_data(df) # Clean and normalize data
        anomalies = detect_anomalies(df, column,algorithm) 
        anomaly_count = len(anomalies) # Count the amount of detected anomalies

        # Return results as JSON
        return jsonify({
            "message": f"File '{file.filename}' uploaded successfully!",
            "anomalies": anomalies,
            "anomaly_count": anomaly_count # Include the counnt in repsonse
            
        })

    except Exception as e:
        return jsonify({"message": f"Error processing file: {str(e)}"}), 500 # Return error if processing fails

# Run the App on port 5001 
if __name__ == '__main__':
    app.run(debug=True, port=5001)
