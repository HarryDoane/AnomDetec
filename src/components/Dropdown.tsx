import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Dropdown.css";

const Dropdown = () => {
  return (
    <div className="dropdown custom-dropdown">
      <button
        className="btn dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Select an algorithm to use...
      </button>

      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <a className="dropdown-item" href="#">
            Algorithm 1
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Algorithm 2
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Algorithm 3
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
