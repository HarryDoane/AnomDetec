import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Dropdown.css";

// Define the properties for interfance for Dropdown comment
// Passes data from a parent compenet into child compenent
// Defines what "DropDown" will recieve
// Interface acts as a blueprint or contract for object, specifies properties and data
interface DropdownProps {
  onSelectAlgorithm: (algorithm: string) => void; // Function to handle algorithm selection, passing a string,
  // not returning anything (void)
  disabled: boolean; // Boolean used to disable drop down when needed
}
// Define Dropdown compenet as a function React compenent
const Dropdown: React.FC<DropdownProps> = ({ onSelectAlgorithm, disabled }) => {
  // Disabled is True meaning it is disabled
  // State that keeps track of currently selected algorithm
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>( // React Hook allowing a state to added
    // Returning state value and a function to update value
    "Select an algorithm for use..." // Default text for dropdown
  );
  // React Hooks let you add features such as keeping track of data (state)
  // allows same functionality without classes

  // Function handling when a user selects an algorithm
  const handleSelect = (algorithm: string) => {
    if (!disabled) {
      // Ensures dropdown is not disabled before setting state
      console.log("algorithm selected:", algorithm); // Log selected algorithm for debugging
      setSelectedAlgorithm(algorithm); // Updates selected algorithm state
      onSelectAlgorithm(algorithm); // Call function passed through properties interface
    } else {
      console.log("Dropdown disabled"); // Logs message if disabled
    }
  };

  return (
    <div className={`dropdown-container ${disabled ? "disabled" : ""}`}>
      {/* Allows for the container to be styled for when the dropdown is disabled or not*/}
      <div className={`dropdown custom-dropdown ${disabled ? "disabled" : ""}`}>
        <button
          className="btn btn-dark dropdown-toggle" // Bootstrap styling for button
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown" // Bootstrap attribute for dropdown functionality
          aria-haspopup="true"
          aria-expanded="false"
          disabled={disabled} // Disable button if 'disabled' is true
        >
          {selectedAlgorithm} {/* Display selected algorithm or default text */}
        </button>

        {/* Drop down menu*/}
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <button
              className="dropdown-item" // Bootstrap styling for dropdown item
              onClick={() => handleSelect("isolation_forest")} // Set algorithm to Isolation Forest
              disabled={disabled} // Disable option if dropdown is disabled
            >
              Isolation Forest
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("lof")} // Set algorithm to Local Outlier Factor
              disabled={disabled}
            >
              Local Outlier Factor
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("z_score")} // Set algorithm to Z-score method
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
