import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===== FastAPI app =====
app = FastAPI(title="Churn Prediction API", version="0.1.0")

# ===== CORS Middleware =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Load Model =====
MODEL_PATH = os.path.join("models", "model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# ===== Request Schema =====
class CustomerData(BaseModel):
    CreditScore: float
    Geography: str
    Gender: str
    Age: int
    Tenure: int
    Balance: float
    NumOfProducts: int
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float


# ===== Helper for encoding categorical values =====
def preprocess_input(data: CustomerData):
    df = pd.DataFrame([data.dict()])

    # Encode categorical values
    df = pd.get_dummies(df, columns=["Geography", "Gender"], drop_first=True)

    # Ensure same columns as training data
    expected_cols = [
        'CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts',
        'HasCrCard', 'IsActiveMember', 'EstimatedSalary',
        'Geography_Germany', 'Geography_Spain', 'Gender_Male'
    ]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0
    df = df[expected_cols]

    return df


# ===== Prediction Endpoint =====
@app.post("/predict")
async def predict(data: CustomerData):
    if model is None:
        return {"error": "Model not loaded correctly."}

    try:
        processed = preprocess_input(data)
        prediction = model.predict(processed)
        probability = model.predict_proba(processed).tolist()[0]
        return {
            "prediction": int(prediction[0]),
            "probability": probability
        }
    except Exception as e:
        return {"error": str(e)}


# ===== Root Endpoint =====
@app.get("/")
async def root():
    return {"message": "Churn Prediction API is running 🚀"}
