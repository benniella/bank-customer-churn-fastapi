from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np

# ====================================================
# Load the trained model
# ====================================================
model = joblib.load("model.pkl")

# ====================================================
# Initialize FastAPI app
# ====================================================
app = FastAPI(title="Churn Prediction API", version="1.0.0")

# Enable CORS so frontend (React) can communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict later to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================================================
# Define input schema
# ====================================================
class CustomerData(BaseModel):
    credit_score: float
    gender: int
    age: int
    tenure: int
    balance: float
    products_number: int
    credit_card: int
    active_member: int
    estimated_salary: float
    country: str

# ====================================================
# Helper function for preprocessing
# ====================================================
def preprocess_input(data: CustomerData) -> pd.DataFrame:
    df = pd.DataFrame([data.dict()])

    # One-hot encode 'country' manually
    countries = ["France", "Spain", "Germany"]
    for c in countries:
        df[f"country_{c}"] = 1 if data.country == c else 0

    # Drop original country column
    df = df.drop(columns=["country"], errors="ignore")

    # Expected columns (must match training order)
    expected_columns = [
        "credit_score", "gender", "age", "tenure", "balance",
        "products_number", "credit_card", "active_member",
        "estimated_salary", "country_France", "country_Spain", "country_Germany"
    ]

    # Ensure all columns exist
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0

    # Reorder & cast everything to float
    df = df[expected_columns].astype(float)

    return df

# ====================================================
# Prediction endpoint
# ====================================================
@app.post("/predict")
async def predict(data: CustomerData):
    try:
        processed = preprocess_input(data)
        prediction = model.predict(processed)[0]

        probability = None
        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(processed)[0][1])

        return {
            "success": True,
            "prediction": int(prediction),
            "probability": probability,
            "message": "Prediction successful"
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Prediction failed due to an internal error."
        }

# ====================================================
# Root endpoint
# ====================================================
@app.get("/")
async def home():
    return {"message": "Bank Customer Churn Prediction API is live!"}
