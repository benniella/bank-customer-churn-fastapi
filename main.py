from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# Load the dictionary
model = joblib.load("models/model.joblib")
THRESHOLD = 0.3
# Initialize FastAPI app
app = FastAPI()

# Input schema (raw features as they appear before preprocessing)
class CustomerData(BaseModel):
    CreditScore: float
    Gender: int
    Age: float
    Tenure: float
    Balance: float
    NumOfProducts: float
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float
    Geography: str

@app.get("/")
def home():
    return {"message": "Bank Customer Churn Prediction API is running!"}

# Prediction endpoint
@app.post("/predict")
def predict(data: CustomerData):
    # Convert input into DataFrame-like row (dict → array)
    X = pd.DataFrame([{
        "CreditScore": data.CreditScore,
        "Gender": data.Gender,
        "Age": data.Age,
        "Tenure": data.Tenure,
        "Balance": data.Balance,
        "NumOfProducts": data.NumOfProducts,
        "HasCrCard": data.HasCrCard,
        "IsActiveMember": data.IsActiveMember,
        "EstimatedSalary": data.EstimatedSalary,
        "Geography": data.Geography
    }])

    # Pipeline handles preprocessing internally
    proba = model.predict_proba(X)[0][1]
    prediction = int(proba >= THRESHOLD)

    return {
        "churn_probability": float(proba),
        "prediction": "Churn" if prediction == 1 else "No Churn",
        "threshold": THRESHOLD
    }
