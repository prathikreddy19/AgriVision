import React, { useState } from "react";

function YieldPredictor() {
  const [formData, setFormData] = useState({
    district: "",
    crop: "",
    season: "",
    soil: { pH: "", N: "", P: "", K: "", OC: "" },
    weather: { rainfall: "", temperature: "" },
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Example dropdown data
  const districts = [
    "Hyderabad", "Warangal", "Karimnagar", "Adilabad",
    "Nalgonda", "Khammam", "Mahbubnagar", "Medak",
    "Ranga Reddy", "Suryapet"
  ];

  const crops = ["Rice", "Wheat", "Maize", "Cotton", "Pulses"];
  const seasons = ["Kharif", "Rabi", "Zaid"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["pH", "N", "P", "K", "OC"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        soil: { ...prev.soil, [name]: value },
      }));
    } else if (["rainfall", "temperature"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        weather: { ...prev.weather, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error(err);
      setPrediction("❌ Error while predicting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px 40px",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "650px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#2c3e50" }}>
          🌾 Crop Yield Predictor
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* District Dropdown */}
          <label style={{ fontWeight: "600", color: "#34495e" }}>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              maxHeight: "130px",
              overflowY: "auto",
            }}
          >
            <option value="">-- Select District --</option>
            {districts.map((dist, idx) => (
              <option key={idx} value={dist}>
                {dist}
              </option>
            ))}
          </select>

          {/* Crop Dropdown */}
          <label style={{ fontWeight: "600", color: "#34495e" }}>Crop</label>
          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Select Crop --</option>
            {crops.map((crop, idx) => (
              <option key={idx} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          {/* Season Dropdown */}
          <label style={{ fontWeight: "600", color: "#34495e" }}>Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Select Season --</option>
            {seasons.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>

          <h4 style={{ marginTop: "15px", color: "#2c3e50" }}>🧪 Soil Data</h4>
          <input type="number" step="0.1" name="pH" placeholder="Soil pH" value={formData.soil.pH} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number" name="N" placeholder="Nitrogen (N)" value={formData.soil.N} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number" name="P" placeholder="Phosphorus (P)" value={formData.soil.P} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number" name="K" placeholder="Potassium (K)" value={formData.soil.K} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number" step="0.01" name="OC" placeholder="Organic Carbon" value={formData.soil.OC} onChange={handleChange} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />

          <h4 style={{ marginTop: "15px", color: "#2c3e50" }}>🌦 Weather Data</h4>
          <input type="number" name="rainfall" placeholder="Rainfall (mm)" value={formData.weather.rainfall} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number" step="0.1" name="temperature" placeholder="Temperature (°C)" value={formData.weather.temperature} onChange={handleChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "18px",
              background: "#27ae60",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              border: "none",
              transition: "background 0.2s",
            }}
          >
            {loading ? "⏳ Predicting..." : "Predict Yield"}
          </button>
        </form>

        {prediction !== null && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#ecf9f1",
              border: "1px solid #2ecc71",
              borderRadius: "8px",
              textAlign: "center",
              color: "#27ae60",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            🌱 Predicted Yield: {prediction} quintal/ha
          </div>
        )}
      </div>
    </div>
  );
}

export default YieldPredictor;
