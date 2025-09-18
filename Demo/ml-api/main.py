from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# Load model and features
model = joblib.load("yield_lightgbm.pkl")
feature_names = joblib.load("feature_names.pkl")

app = FastAPI()

# ✅ Allow React (localhost:3000) to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # only React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoilData(BaseModel):
    pH: float
    N: float
    P: float
    K: float
    OC: float | None = 0  # optional

class WeatherData(BaseModel):
    rainfall: float
    temperature: float

class InputData(BaseModel):
    district: str
    crop: str
    season: str
    soil: SoilData
    weather: WeatherData

def build_feature_vector(data: InputData):
    input_data = pd.DataFrame([[0] * len(feature_names)], columns=feature_names)

    # One-hot categorical features
    for col in [f"District_{data.district}", f"Crop_{data.crop}", f"Season_{data.season}"]:
        if col in input_data.columns:
            input_data[col] = 1

    # Soil
    input_data["soil_ph"] = data.soil.pH
    input_data["soil_nitrogen"] = data.soil.N
    input_data["soil_phosphorus"] = data.soil.P
    input_data["soil_potassium"] = data.soil.K
    input_data["soil_organic_carbon"] = data.soil.OC

    # Weather
    input_data["rainfall_total"] = data.weather.rainfall
    input_data["avg_temp"] = data.weather.temperature

    return input_data

@app.post("/predict")
def predict(data: InputData):
    try:
        fv = build_feature_vector(data)
        pred = model.predict(fv)[0]
        return {"prediction": float(pred)}
    except Exception as e:
        return {"error": str(e)}
