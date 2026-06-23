import React, { useState } from "react";
import "./styles.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false); // Close menu after clicking
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>🐦‍🔥Travel Planner</h1>
      </div>

      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✖" : "☰"}
      </button>

      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <span onClick={() => scrollTo("home")}>Home</span>
        <span onClick={() => scrollTo("destination")}>Destinations</span>
        <span onClick={() => scrollTo("travel")}>Trips</span>
      </nav>
    </header>
  );
}

export default Header;