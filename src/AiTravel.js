import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter"
];

function TravelPlanner() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [interest, setInterest] = useState(""); // "food" | "nature" | "historical"
  const [coords, setCoords] = useState(null);

  const [tripPlan, setTripPlan] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const travelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.2 }
    );
    if (travelRef.current) observer.observe(travelRef.current);
    return () => observer.disconnect();
  }, []);

  // Step 1: City submit -> get coords + weather
  const handleCitySubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setTripPlan([]);
    setCoords(null);

    try {
      const cityRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: city, count: 1, language: "en", format: "json" } }
      );

      if (!cityRes.data.results || cityRes.data.results.length === 0) {
        setError("❌ Invalid City Name");
        setLoading(false);
        return;
      }

      const { latitude: lat, longitude: lon } = cityRes.data.results[0];
      setCoords({ lat, lon });

      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        { params: { latitude: lat, longitude: lon, current_weather: true } }
      );

      setWeather(weatherRes.data.current_weather);
    } catch (err) {
      setError("❌ Could not fetch city/weather. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: try multiple overpass mirrors until one works
  const fetchFromOverpass = async (query) => {
    for (const url of OVERPASS_ENDPOINTS) {
      try {
        const res = await axios.post(url, query, {
          headers: { "Content-Type": "text/plain" },
          timeout: 15000
        });
        if (res.data?.elements?.length) return res.data.elements;
      } catch (err) {
        // try next mirror
      }
    }
    return [];
  };

  // Step 2: Interest button click -> get places
  const handleInterestClick = async (type) => {
    if (!coords) {
      setError("⚠️ Pehle city search karein");
      return;
    }
    setInterest(type);
    setLoading(true);
    setError("");
    setTripPlan([]);

    const { lat, lon } = coords;
    let query = "";

    if (type === "food") {
      query = `[out:json][timeout:20];(node["amenity"="restaurant"](around:8000,${lat},${lon});node["amenity"="cafe"](around:8000,${lat},${lon});node["amenity"="fast_food"](around:8000,${lat},${lon}););out body;`;
    } else if (type === "nature") {
      query = `[out:json][timeout:20];(node["natural"](around:10000,${lat},${lon});node["leisure"="park"](around:10000,${lat},${lon});node["tourism"="viewpoint"](around:10000,${lat},${lon}););out body;`;
    } else if (type === "historical") {
      query = `[out:json][timeout:20];(node["historic"](around:10000,${lat},${lon});node["tourism"="museum"](around:10000,${lat},${lon}););out body;`;
    }

    try {
      const elements = await fetchFromOverpass(query);

      const filtered = elements.filter(
        (item) => item.tags && item.tags.name && item.tags.name !== "yes"
      );

      if (filtered.length === 0) {
        setError("❌ Is category me koi jagah nahi mili, dusra category try karein");
        setLoading(false);
        return;
      }

      const shuffled = filtered.sort(() => 0.5 - Math.random());
      const count = Number(days) > 0 ? Number(days) : 5;
      const finalPlaces = shuffled.slice(0, count);

      const plan = finalPlaces.map((item, index) => ({
        day: index + 1,
        place: item.tags.name
      }));

      setTripPlan(plan);
    } catch (err) {
      setError("❌ Places fetch karne me error aaya, dobara try karein");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main travel-section" ref={travelRef}>
      <div className={`travel-form-container ${isVisible ? "unfold-animation" : ""}`}>
        <h2>WanderWise 🌍✨</h2>
        <p className="form-subtitle">Let's design your dream journey</p>

        <form className="travel-form" onSubmit={handleCitySubmit}>
          <div className="input-group">
            <span className="input-icon">📍</span>
            <input
              type="text"
              name="DESTINATION"
              placeholder="Where to? (e.g. Paris)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">📅</span>
            <input
              type="number"
              name="DAYS"
              placeholder="How many days?"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <button type="submit" className={`generate-btn ${loading ? "loading-state" : ""}`} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Search City"}
          </button>
        </form>

        {/* Interest buttons - sirf city/weather aane ke baad enable */}
        <div className="interest-buttons" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            type="button"
            className={interest === "food" ? "active-interest" : ""}
            disabled={!coords || loading}
            onClick={() => handleInterestClick("food")}
          >
            🍔 Food
          </button>
          <button
            type="button"
            className={interest === "nature" ? "active-interest" : ""}
            disabled={!coords || loading}
            onClick={() => handleInterestClick("nature")}
          >
            🌳 Nature
          </button>
          <button
            type="button"
            className={interest === "historical" ? "active-interest" : ""}
            disabled={!coords || loading}
            onClick={() => handleInterestClick("historical")}
          >
            🏛️ Travel / Historical
          </button>
        </div>
      </div>

      {error && (
        <div className="error-box pulse-error">
          <p>{error}</p>
        </div>
      )}

      {weather && (
        <div className="weather-widget pop-up">
          <h3>🌤 Current Weather in {city}</h3>
          <p>🌡 Temperature: <strong>{weather.temperature}°C</strong></p>
          <p>💨 Wind Speed: <strong>{weather.windspeed} km/h</strong></p>
        </div>
      )}

      {tripPlan.length > 0 && (
        <table className="modern-trip-table fade-in-up">
          <thead>
            <tr>
              <th>#</th>
              <th>Place to Visit</th>
            </tr>
          </thead>
          <tbody>
            {tripPlan.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: "bold", color: "#0ea5e9" }}>{item.day}</td>
                <td>{item.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TravelPlanner;