import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Dropdown from "./Dropdown";
import "./PromptWithFileUpload.css";
import { ChartOptions } from "chart.js";

Chart.register(...registerables); // Register Chart.js modules for proper chart rendering
const PromptWithFileUpload = () => {
  // State variables
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Stores the uploaded file
  const [algorithm, setAlgorithm] = useState<string>(""); // Stores selected anomaly detection algorithm
  const [columns, setColumns] = useState<string[]>([]); // Stores available columns for the uploaded dataset
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Stores slected colum for detection
  const [anomalies, setAnomalies] = useState<any[]>([]); // Stores detcted anomalies
  const [anomalyCount, setAnomalyCount] = useState<number | null>(null); // Stores totla anomly count

  // Function handlign the file selection and sends it to backend to extract columns
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]; // get the selected file
      setSelectedFile(file); // store selected file
      setAlgorithm(""); // Reser selecred algorithm
      setSelectedColumn(""); // Reset selected column

      // Send file to backend to extract column names
      // Built in JavaScript object to sned data via HTTP request
      // "file" being the key and file being the value
      const formData = new FormData();
      formData.append("file", file); // Append the file to FormData for sending to backend

      try {
        console.log("Fetching columns from backend...");
        const response = await fetch("http://localhost:5001/columns", {
          method: "POST",
          body: formData, // Sending file backend
        });

        const result = await response.json();
        console.log("Columns received:", result.columns);

        if (result.columns && result.columns.length > 0) {
          setColumns(result.columns);
        } else {
          console.log("No columns detected");
        }
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    }
  };

  //  Fucntion to handle the file upload and anomaly detection requests
  const handleUpload = async () => {
    if (!selectedFile || !algorithm || !selectedColumn) {
      alert("Please select a file, column, and algorithm."); // alert if any of fields are missing
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Append the file
    formData.append("algorithm", algorithm); // Append the selected algorithm
    formData.append("column", selectedColumn); // Append the selected column

    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData, // sned request to backend
      });

      const result = await response.json();
      console.log("Response from backend:", result);

      if (response.ok) {
        setAnomalies(result.anomalies); // Store dected anomalies
        setAnomalyCount(result.anomaly_count); // Store anomaly count
        alert(`Upload successful: ${result.message}`); // Show success message
      } else {
        alert(`Error uploading file: ${result.message}`); // error message
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };
  // Chart.js configuration options for anomaly graph
  const anomalyChartOptions: ChartOptions<"line"> = {
    responsive: true, // Makes it responsive
    maintainAspectRatio: true, // Maintains aspect ratio
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 15 }, // Reduces crowded labels for x axis
      },
      y: {
        title: { display: true, text: "Packet Size" }, // Adds Y-axis label
      },
    },
    elements: {
      point: { radius: 4 }, // Adjust size of anomaly points
      line: { borderWidth: 2 }, // Makes anomalies easier to see
    },
    plugins: {
      legend: { display: true, position: "top" as const }, // Puts legend at the top
    },
  };

  const anomalyChartData = {
    labels: anomalies.map((_, index) => `Anomaly ${index + 1}`), // labels each anoamly on x-axis
    datasets: [
      {
        label: `Anomalies in ${selectedColumn}`, // Chart label with user selected column
        data: anomalies.map((anomaly) => anomaly[selectedColumn]), // Plots detected anomilies
        fill: true,
        backgroundColor: "gray",
        borderColor: "#6842d1",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="file-upload-container">
      <p className="import-text">Please import a file...</p>

      {/* File Upload Input */}
      <div className="input-group file-upload-box">
        <label className="input-group-text" htmlFor="fileInput">
          Upload
        </label>
        <input
          type="file"
          className="form-control"
          id="fileInput"
          onChange={handleFileChange} // Calls handleFileChange when the file is selcted
        />
      </div>

      {/* Column Selection Dropdown (Visible after file upload) */}
      {columns.length > 0 && (
        <div className="mb-3">
          <label>Select a column:</label>
          <select
            className="form-select"
            onChange={(e) => {
              console.log("Selected Column:", e.target.value);
              setSelectedColumn(e.target.value); // Store the selcted column
            }}
          >
            <option value="">Select column...</option>
            {columns.map((col, index) => (
              <option key={index} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Algorithm Dropdown (Disabled until file is uploaded) */}
      <div className="dropdown-container">
        <Dropdown onSelectAlgorithm={setAlgorithm} disabled={!selectedFile} />
      </div>
      {/* Upload Button (Disabled until both file & algorithm are selected) */}
      <button
        onClick={handleUpload}
        className="btn btn-primary mt-3 detect-button"
        disabled={!selectedFile || !algorithm || !selectedColumn}
      >
        Detect Anomalies
      </button>
      {/* Display Anomaly Count (only Show if Anomalies Exist) */}
      {anomalyCount !== null && (
        <p className="anomaly-count">
          Total Anomalies Detected: {anomalyCount}
        </p>
      )}
      {/* Display Graph*/}
      <div className="graph-wrapper">
        <div className="graph-container">
          {anomalies.length > 0 && (
            <div className="mt-4" style={{ width: "80%", maxWidth: "800px" }}>
              <h3 className="Graph-Title">Detected Anomalies</h3>
              <Line data={anomalyChartData} options={anomalyChartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PromptWithFileUpload;
