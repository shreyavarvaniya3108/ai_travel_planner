
import React, { useState, useEffect } from "react";

// Aapke apne folder se images import! (No load errors anymore)
import img1 from "./image/Jaipur.jpg";
import img2 from "./image/Rishikesh.avif";
import img3 from "./image/kashmir.webp";
import img4 from "./image/img.jpg";
import img5 from "./image/river.png";

const images = [img1, img2, img3, img4, img5];

function Home({ setPage }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Background Slider animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 4000); // Har 4 second me left-right slide hoga
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="home">
      
      {/* 🌟 NEW: FULL SCREEN BACKGROUND SLIDER 🌟 */}
      <div className="hero-slider-fullscreen">
        {images.map((img, index) => (
          <img 
            key={index}
            src={img}
            alt={`travel-slide-${index}`}
            className={`fullscreen-slide ${index === currentIdx ? "active" : ""}`}
          />
        ))}
      </div>

      {/* GRADIENT OVERLAY (Images ko thoda soft karega) */}
      <div className="hero-gradient-overlay"></div>

      <div className="hero text-center-hero">
        
        {/* CENTERED EPIC 3D GLASS DIV */}
        <div className="hero-content custom-text-pattern text-centered-box">
          <h1 className="hero-title">
            Welcome To WanderWise 🌍✈️
          </h1>
          <p className="hero-subtitle">
            Smart AI Travel Planner
          </p>
          
          <div className="hero-btns center-buttons">
            <button className="start-btn" onClick={() => document.getElementById("travel")?.scrollIntoView({ behavior: "smooth" })}>
              Plan Trip
            </button>
            <button className="learn-btn" onClick={() => document.getElementById("destination")?.scrollIntoView({ behavior: "smooth" })}>
              Explore
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;
