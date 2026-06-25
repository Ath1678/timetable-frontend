import React from "react";
import "../styles/navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <h3>Dashboard</h3>

      <div className="user">
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
