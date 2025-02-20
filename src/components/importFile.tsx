import "./importFile.css";
import React from "react";

const FileUpload: React.FC = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("Selected file:", event.target.files[0]);
    }
  };

  return (
    <div className="file-upload-container">
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
    </div>
  );
};

export default FileUpload;
