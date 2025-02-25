import React, { useState } from "react";
import Dropdown from "./Dropdown";
import "./PromptWithFileUpload.css";

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
        const response = await fetch("http://localhost:5001/columns", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setColumns(result.columns || []);
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

  return (
    <div className="d-flex flex-column align-items-center mt-3">
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
            onChange={(e) => setSelectedColumn(e.target.value)}
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
      <Dropdown onSelectAlgorithm={setAlgorithm} disabled={!selectedFile} />

      {/* Upload Button (Disabled until both file & algorithm are selected) */}
      <button
        onClick={handleUpload}
        className="btn btn-primary mt-3"
        disabled={!selectedFile || !algorithm || !selectedColumn}
      >
        Detect Anomalies
      </button>

      {/* Display Anomalies */}
      {anomalies.length > 0 && (
        <div className="mt-4">
          <h3>Detected Anomalies</h3>
          <table
            style={{ border: "1px solid black", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "5px" }}>
                  {selectedColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    {anomaly[selectedColumn]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromptWithFileUpload;
