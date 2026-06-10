import React from "react";
import "./styles.css";

function Header() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header">

      <h1>🐦‍🔥 AI Travel Planner</h1>

      <nav className="nav-links">
        <span onClick={() => scrollTo("home")}>Home</span>
        <span onClick={() => scrollTo("destination")}>Destinations</span>
        <span onClick={() => scrollTo("travel")}>Trips</span>
      </nav>

    </header>
  );
}

export default Header;