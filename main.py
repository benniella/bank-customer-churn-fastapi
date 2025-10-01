from fastapi import FastAPI
import joblib
import pandas as pd

# Load model
model = joblib.load("models/model.pkl")

# Best threshold from your tuning
BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API")


@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!"}


@app.post("/predict")
def predict(features: dict):
    # Convert input dict to DataFrame
    data = pd.DataFrame([features])

    # Get churn probability
    proba = model.predict_proba(data)[:, 1][0]

    # Apply threshold
    prediction = int(proba >= BEST_THRESHOLD)

    return {
        "churn_probability": round(float(proba), 3),
        "prediction": "Churn" if prediction == 1 else "Stay"
    }
