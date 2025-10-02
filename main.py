from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    credit_card: str
    active_member: str
    estimated_salary: float
    gender: str
    country: str


# Load model
model = joblib.load("models/model.pkl")
BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API")

# 🚀 Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, or use ["https://bank-churn.bennytechhub.com"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!"}


@app.post("/predict")
def predict(features: CustomerFeatures):
    # Convert request body to dictionary
    feature_dict = features.dict()

    # Convert yes/no → 1/0 explicitly
    yes_no_fields = ["credit_card", "active_member"]
    for field in yes_no_fields:
        val = str(feature_dict[field]).lower()
        feature_dict[field] = 1 if val in ["yes", "1", "true"] else 0

    # Make sure products_number is an integer
    feature_dict["products_number"] = int(feature_dict["products_number"])

    # Create numeric DataFrame
    X = pd.DataFrame([feature_dict])

    # Debug check: print the cleaned row
    print("Cleaned features going into model:", X.to_dict(orient="records"))

    # Predict churn probability
    proba = model.predict_proba(X)[:, 1][0]
    prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"

    return {
        "prediction": prediction,
        "churn_probability": round(float(proba), 3),
        "threshold": BEST_THRESHOLD
    }
