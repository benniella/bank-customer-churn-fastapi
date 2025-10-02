from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib


# Define input schema
class CustomerFeatures(BaseModel):
    credit_score: int
    age: int
    tenure: int
    balance: float
    products_number: int
    credit_card: int
    active_member: int
    estimated_salary: float
    gender: str
    country: str


# Load model
model = joblib.load("models/model.pkl")
BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API")


@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!"}


@app.post("/predict")
def predict(features: CustomerFeatures):
    # Convert input to DataFrame
    X = pd.DataFrame([features.dict()])

    # Predict churn probability
    proba = model.predict_proba(X)[:, 1][0]
    prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"

    return {
        "prediction": prediction,
        "churn_probability": round(float(proba), 3),
        "threshold": BEST_THRESHOLD
    }
