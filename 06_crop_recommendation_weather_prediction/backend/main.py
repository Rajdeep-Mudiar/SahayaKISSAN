from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import keras
import joblib
import requests
import numpy as np
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = FastAPI()


# Allow React frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.onrender.com", "*"],  # Update with your frontend URL
    

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
crop_model = keras.models.load_model("../models/crop_recommendation_model.h5")
weather_model = keras.models.load_model("../models/weather_prediction.h5")
try:
    scaler = joblib.load("../models/scaler.pkl")
except FileNotFoundError:
    scaler = None

# Weather classes based on training
WEATHER_CLASSES = ['drizzle', 'fog', 'rain', 'snow', 'sun']

# Crop classes (order must match training label encoder)
CROP_CLASSES = [
    'Adzuki Beans', 'Black gram', 'Chickpea', 'Coconut', 'Coffee', 'Cotton',
    'Ground Nut', 'Jute', 'Kidney Beans', 'Lentil', 'Moth Beans', 'Mung Bean',
    'Peas', 'Pigeon Peas', 'Rubber', 'Sugarcane', 'Tea', 'Tobacco', 'apple',
    'banana', 'grapes', 'maize', 'mango', 'millet', 'muskmelon', 'orange',
    'papaya', 'pomegranate', 'rice', 'watermelon', 'wheat'
]

# OpenWeather API Key
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Function to fetch weather
def get_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()
    
    if response.status_code != 200:
        raise Exception(f"Weather API error: {data.get('message', 'Unknown error')}")
    
    return {
        "temperature": data["main"]["temp"],
        "temp_max": data["main"]["temp_max"],
        "temp_min": data["main"]["temp_min"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"],
        "rainfall": data.get("rain", {}).get("1h", 0),
        "month": datetime.now().month
    }

# Prediction endpoint
@app.get("/predict/{city}")
def predict(
    city: str,
    nitrogen: float = 40,
    phosphorus: float = 60,
    potassium: float = 40,
    ph: float = 6.5,
    soil_type: str = "loamy"
):
    try:
        weather = get_weather(city)

        # Weather Prediction (5 features: precipitation, temp_max, temp_min, wind, month)
        weather_input = np.array([[
            weather["rainfall"],  # precipitation
            weather["temp_max"],
            weather["temp_min"],
            weather["wind"],
            weather["month"]
        ]])
        
        if scaler is not None:
            weather_input_scaled = scaler.transform(weather_input)
        else:
            weather_input_scaled = weather_input
            
        weather_pred_idx = np.argmax(weather_model.predict(weather_input_scaled), axis=1)[0]
        weather_pred = WEATHER_CLASSES[weather_pred_idx]

        # Encode soil type
        soil_type_encoding = {
            "loamy": 0,
            "sandy": 1,
            "clayey": 2,
            "silt": 3,
            "peaty": 4
        }
        soil_encoded = soil_type_encoding.get(soil_type.lower(), 0)

        # Crop Recommendation (9 features: N, P, K, temperature, humidity, ph, rainfall, soil_type, ?)
        crop_input = np.array([[
            nitrogen,
            phosphorus,
            potassium,
            weather["temperature"],
            weather["humidity"],
            ph,
            weather["rainfall"],
            soil_encoded,
            0    # padding/additional feature if needed
        ]])

        # Note: Crop model was trained with scaled data but scaler wasn't saved
        # Using raw values - ideally retrain and save scaler
        crop_probs = crop_model.predict(crop_input)[0]
        crop_pred_idx = int(np.argmax(crop_probs))

        # Align class names to the model's output dimension to avoid "Unknown" responses
        model_num_classes = len(crop_probs)
        class_names = CROP_CLASSES if len(CROP_CLASSES) == model_num_classes else [f"class_{i}" for i in range(model_num_classes)]
        crop = class_names[crop_pred_idx]

        # Provide top-3 for transparency/debugging
        top3_indices = np.argsort(crop_probs)[::-1][:3]
        top_crops = [
            {
                "crop": class_names[idx],
                "probability": float(crop_probs[idx])
            }
            for idx in top3_indices
        ]

        # Optional tips
        tips = []
        if weather["rainfall"] > 20:
            tips.append("Heavy rain expected. Avoid sowing today.")
        if weather["rainfall"] < 5:
            tips.append("Very low rainfall. Schedule irrigation within 24 hours.")
        if weather["temperature"] > 35:
            tips.append("High temperature. Water the crops adequately.")
        if weather["temp_min"] < 10:
            tips.append("Cool nights expected. Consider mulching to retain soil warmth.")
        if weather_pred in ['rain', 'drizzle']:
            tips.append("Rainy weather predicted. Ensure proper drainage.")
        if weather["humidity"] < 40:
            tips.append("Low humidity. Consider irrigation.")
        if weather["humidity"] > 85:
            tips.append("Very high humidity. Increase field airflow to reduce disease risk.")
        if weather["wind"] > 10:
            tips.append("High winds expected. Stake young plants and secure tunnels.")
        
        # Soil-based tips
        if nitrogen < 30:
            tips.append("Nitrogen level is low. Apply nitrogen-rich fertilizers.")
        if phosphorus < 20:
            tips.append("Phosphorus level is low. Consider phosphate fertilizers.")
        if potassium < 25:
            tips.append("Potassium is low. Add muriate of potash before irrigation.")
        if ph < 6:
            tips.append("Soil is acidic. Apply lime to increase pH.")
        elif ph > 7.5:
            tips.append("Soil is alkaline. Apply sulfur to decrease pH.")
        if soil_type.lower() in ["sandy", "silt"]:
            tips.append("Light soil. Use organic mulches to improve moisture retention.")
        if soil_type.lower() in ["clayey", "peaty"]:
            tips.append("Heavy soil. Avoid waterlogging and loosen top layer before sowing.")

        return {
            "city": city,
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "predicted_weather": weather_pred,
            "recommended_crop": crop,
            "top_crops": top_crops,
            "soil_nutrients": {
                "nitrogen": nitrogen,
                "phosphorus": phosphorus,
                "potassium": potassium,
                "ph": ph,
                "soil_type": soil_type
            },
            "model_num_classes": model_num_classes,
            "tips": tips
        }
    except Exception as e:
        return {"error": str(e)}
