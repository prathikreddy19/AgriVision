const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Route to call FastAPI
app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/predict", {
      features: req.body.features
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
