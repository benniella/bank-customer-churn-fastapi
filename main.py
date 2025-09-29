from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# Load the model
model = joblib.load("models/model.joblib")
THRESHOLD = 0.3

# Initialize FastAPI app
app = FastAPI()

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:5173"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
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

@app.post("/predict")
def predict(data: CustomerData):
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

    proba = model.predict_proba(X)[0][1]
    prediction = int(proba >= THRESHOLD)

    return {
        "churn_probability": float(proba),
        "prediction": "Churn" if prediction == 1 else "No Churn",
        "threshold": THRESHOLD
    }
