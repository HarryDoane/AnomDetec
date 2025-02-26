import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Dropdown from "./Dropdown";
import "./PromptWithFileUpload.css";
import { ChartOptions } from "chart.js";

Chart.register(...registerables);
const PromptWithFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [anomalies, setAnomalies] = useState<any[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setAlgorithm("");
      setSelectedColumn("");

      // Send file to backend to extract column names
      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("Fetching columns from backend...");
        const response = await fetch("http://localhost:5001/columns", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("📬 Columns received:", result.columns);

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

  const handleUpload = async () => {
    if (!selectedFile || !algorithm || !selectedColumn) {
      alert("Please select a file, column, and algorithm.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("algorithm", algorithm);
    formData.append("column", selectedColumn);

    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Response from backend:", result);

      if (response.ok) {
        setAnomalies(result.anomalies);
        alert(`Upload successful: ${result.message}`);
      } else {
        alert(`Error uploading file: ${result.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };
  const anomalyChartOptions: ChartOptions<"line"> = {
    responsive: true, // Makes it responsive
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 15 }, // Reduces crowded labels
      },
      y: {
        title: { display: true, text: "Packet Size" }, // Adds Y-axis label
      },
    },
    elements: {
      point: { radius: 4 },
      line: { borderWidth: 2 }, // Makes anomalies easier to see
    },
    plugins: {
      legend: { display: true, position: "top" as const }, // Moves legend for clarity
    },
  };

  const anomalyChartData = {
    labels: anomalies.map((_, index) => `Anomaly ${index + 1}`), // X-axis labels
    datasets: [
      {
        label: `Anomalies in ${selectedColumn}`,
        data: anomalies.map((anomaly) => anomaly[selectedColumn]), // Y-axis values
        fill: true,
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        borderColor: "red",
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
          onChange={handleFileChange}
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
              setSelectedColumn(e.target.value);
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

      {/* Display Graph Instead of Table */}
      {anomalies.length > 0 && (
        <div className="mt-4" style={{ width: "80%", maxWidth: "600px" }}>
          <h3>Detected Anomalies</h3>
          <Line data={anomalyChartData} options={anomalyChartOptions} />
        </div>
      )}
    </div>
  );
};
export default PromptWithFileUpload;
