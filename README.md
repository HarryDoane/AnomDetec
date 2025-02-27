# PktWatch - Anomaly Detection for Network Traffic 

## Project Overview  
PktWatch is a web-based anomaly detection tool designed to help users identify patterns in network traffic datasets. By leveraging machine learning algorithms such as Isolation Forest, Local Outlier Factor (LOF), and Z-Score, this tool allows users to upload CSV files, analyze packet size variations, and detect potential anomalies in semi real-time. 

## Features  
-  **CSV File Upload** – Users can upload network traffic datasets for analysis.  
-  **Graphical Visualization** – Anomalies are plotted using Chart.js.  
-  **Multiple Detection Algorithms** – Supports Isolation Forest, LOF, and Z-Score for detection.  
-  **Anomaly Count Display** – Shows the total number of detected anomalies.  
-  **Flask Backend** – Processes uploaded files and runs anomaly detection algorithms.  
-  **React Frontend** – Provides an intuitive and interactive UI.

## Getting Started

## Prerequisistes
Ensure you have the following installed:
- **Node.js** (for frontend)  
- **Python 3** (for backend)  
- **Git** (for version control)

## Clone the Repository
```bash
git clone https://github.com/HarryDoane/AnomDetec.git
cd AnomDetec
```
## Create a Virtual Environment (Optional)
``` bash
python3 -m venv venv
source venv/bin/activate # macOS/Linux
venv\Scripts\activate # Windows
```
## Install Dependencies
``` bash
pip install -r backend/requirements.txt
```
## Run the Flask Server
``` bash
cd backend
python3 app.py # or
python app.py
```
# Frontend Setup
``` bash
cd frontend
npm install
npm run dev
```
## How It Works
- **Upload a CSV file containing network traffic data for packet sizes** 
- **Select a column for analysis** 
- **Choose an detection algorithm**
- **Click "Detect Anomalies" to run detection and view results**
- **Anomalies are now highlighted on graph for analysis**
- **Total number of anomalies displayed above**

## Tech Stack
- **Front end: React.js, Chart.js, Bootstrap**
- **Backend: Flask, Pandas, Scikit-learn, SciPy**
- **Data Processing: Z-score Normalization, Anomaly Detection Models**

