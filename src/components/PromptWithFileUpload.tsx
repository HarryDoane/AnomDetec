import React from "react";
import "./PromptWithFileUpload.css";

const PromptWithFileUpload = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("Selected file:", event.target.files[0]);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <p className="import-text">Please import a file...</p>
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

export default PromptWithFileUpload;
