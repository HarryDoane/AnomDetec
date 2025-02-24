import React, { useState } from "react";
import "./PromptWithFileUpload.css";

const PromptWithFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Automatically trigger upload
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(`Upload successful: ${result.message}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <p className="import-text">Please import a file...</p>

      {/* File Upload Input Group */}
      <div className="input-group file-upload-box">
        <label className="input-group-text" htmlFor="fileInput">
          Upload
        </label>
        <input
          type="file"
          className="form-control"
          id="fileInput"
          onChange={handleFileChange} // Uploads immediately on file selection
        />
      </div>
    </div>
  );
};

export default PromptWithFileUpload;
