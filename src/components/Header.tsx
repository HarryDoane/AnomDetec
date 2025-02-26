import React from "react";
import "./Header.css";
import logo from "../assets/logo-Photoroom.png";
import midpage from "../assets/midepage.png";

const Header = () => {
  return (
    <div className="header-container">
      <img src={logo} alt="Website Logo" className="logo" />
    </div>
  );
};

export default Header;
