import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

function AiTravel() {
  const [formData, setFormData] = useState({
    DESTINATION: "",
    DAYS: "",
    INTERESTS: ""
  });

  const [tripPlan, setTripPlan] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Scroll Animation state
  const [isVisible, setIsVisible] = useState(false);
  const travelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (travelRef.current) {
      observer.observe(travelRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripPlan([]);
    setWeather(null);
    setError("");

    try {
      const cityRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
          params: { name: formData.DESTINATION, count: 1, language: "en", format: "json" }
        }
      );

      if (!cityRes.data.results || cityRes.data.results.length === 0) {
        setError("❌ Invalid City Name");
        setLoading(false);
        return;
      }

      const city = cityRes.data.results[0];
      const lat = city.latitude;
      const lon = city.longitude;

      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: { latitude: lat, longitude: lon, current_weather: true }
        }
      );

      setWeather(weatherRes.data.current_weather);

      let interest = formData.INTERESTS.toLowerCase().trim();
      let query = "";

      if (interest === "food") {
        query = `[out:json];(node["amenity"="restaurant"](around:8000,${lat},${lon});node["amenity"="cafe"](around:8000,${lat},${lon});node["amenity"="fast_food"](around:8000,${lat},${lon});node["amenity"="food_court"](around:8000,${lat},${lon}););out body;`;
      } else if (interest === "nature") {
        query = `[out:json];(node["natural"](around:10000,${lat},${lon});node["leisure"="park"](around:10000,${lat},${lon});node["tourism"="viewpoint"](around:10000,${lat},${lon});node["waterway"](around:10000,${lat},${lon}););out body;`;
      } else if (interest === "historical") {
        query = `[out:json];(node["historic"](around:10000,${lat},${lon});node["tourism"="museum"](around:10000,${lat},${lon});node["historic"="monument"](around:10000,${lat},${lon}););out body;`;
      } else {
        setError("❌ Enter only food / nature / historical");
        setLoading(false);
        return;
      }

      const placesRes = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" }, timeout: 25000 }
      );

      if (!placesRes.data.elements || placesRes.data.elements.length === 0) {
        setError("❌ No Places Found");
        setLoading(false);
        return;
      }

      const filteredPlaces = placesRes.data.elements.filter((item) => item.tags && item.tags.name && item.tags.name !== "yes");
      const shuffledPlaces = filteredPlaces.sort(() => 0.5 - Math.random());
      const finalPlaces = shuffledPlaces.slice(0, Number(formData.DAYS));

      const plan = finalPlaces.map((item, index) => ({
        day: index + 1,
        place: item.tags.name
      }));

      setTripPlan(plan);

    } catch (err) {
      if (err.code === "ECONNABORTED") setError("⏳ API Timeout");
      else setError("❌ API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main travel-section" ref={travelRef}>

      {/* NEW UNIQUE FORM: JAB ISVISIBLE TRUE HOGA, UNFOLD ANIMATION CHALEGA */}
      <div className={`travel-form-container ${isVisible ? "unfold-animation" : ""}`}>
        <h2>WanderWise 🌍✨</h2>
        <p className="form-subtitle">Let AI design your dream journey</p>
        
        <form className="travel-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <span className="input-icon">📍</span>
            <input
              type="text"
              name="DESTINATION"
              placeholder="Where to? (e.g. Paris)"
              value={formData.DESTINATION}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">📅</span>
            <input
              type="number"
              name="DAYS"
              placeholder="How many days?"
              value={formData.DAYS}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🎯</span>
            <input
              type="text"
              name="INTERESTS"
              placeholder="Food / Nature / Historical"
              value={formData.INTERESTS}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={`generate-btn ${loading ? "loading-state" : ""}`} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Generate Magic Plan"}
          </button>
        </form>
      </div>

      {error && <div className="error-box pulse-error"><p>{error}</p></div>}

      {/* WEATHER RESULTS WIDGET */}
      {weather && (
        <div className="weather-widget pop-up">
          <h3>🌤 Current Weather</h3>
          <p>🌡 Temperature: <strong>{weather.temperature}°C</strong></p>
          <p>💨 Wind Speed: <strong>{weather.windspeed} km/h</strong></p>
        </div>
      )}

      {/* MODERN TRIP TABLE */}
      {tripPlan.length > 0 && (
        <table className="modern-trip-table fade-in-up">
          <thead>
            <tr>
              <th>Day</th>
              <th>Place to Visit</th>
            </tr>
          </thead>
          <tbody>
            {tripPlan.map((item, index) => (
              <tr key={index}>
                <td style={{fontWeight: 'bold', color: '#0ea5e9'}}>Day {item.day}</td>
                <td>{item.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default AiTravel;
