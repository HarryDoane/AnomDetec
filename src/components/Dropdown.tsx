import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Dropdown.css";

interface DropdownProps {
  onSelectAlgorithm: (algorithm: string) => void;
  disabled: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelectAlgorithm, disabled }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(
    "Select an algorithm for use..."
  );

  const handleSelect = (algorithm: string) => {
    if (!disabled) {
      setSelectedAlgorithm(algorithm);
      onSelectAlgorithm(algorithm);
    }
  };

  return (
    <div className={`dropdown-container ${disabled ? "disabled" : ""}`}>
      <div className={`dropdown custom-dropdown ${disabled ? "disabled" : ""}`}>
        <button
          className="btn btn-dark dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          disabled={disabled}
        >
          {selectedAlgorithm}
        </button>

        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("isolation_forest")}
              disabled={disabled}
            >
              Isolation Forest
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("lof")}
              disabled={disabled}
            >
              Local Outlier Factor
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("z_score")}
              disabled={disabled}
            >
              Z-Score Method
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
