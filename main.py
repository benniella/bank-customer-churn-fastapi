from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your saved components
model = joblib.load("models/model.joblib")
scaler = joblib.load("models/scaler.joblib")
feature_names = joblib.load("models/feature_names.joblib")

# Pydantic model to validate input
class InputData(BaseModel):
    credit_score: float
    gender: int
    age: float
    tenure: int
    balance: float
    products_number: int
    credit_card: int
    active_member: int
    estimated_salary: float
    country: str


@app.post("/predict")
def predict(data: InputData):
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([data.dict()])

        # 1️⃣ Encode categorical columns manually
        # Handle country (France base → Germany, Spain as one-hot)
        df['country_Germany'] = (df['country'] == 'Germany').astype(int)
        df['country_Spain'] = (df['country'] == 'Spain').astype(int)
        df.drop(columns=['country'], inplace=True)

        # Handle gender (Female = 0, Male = 1)
        df['gender_1'] = df['gender'].astype(int)
        df.drop(columns=['gender'], inplace=True)

        # 2️⃣ Scale numeric columns
        numeric_cols = [
            'credit_score', 'age', 'tenure', 'balance',
            'products_number', 'estimated_salary'
        ]
        df[numeric_cols] = scaler.transform(df[numeric_cols])

        # 3️⃣ Ensure column order matches model training
        X = df.reindex(columns=feature_names, fill_value=0)

        # 4️⃣ Make prediction
        churn_proba = model.predict_proba(X)[0][1]
        prediction = int(churn_proba >= 0.5)

        return {
            "prediction": prediction,
            "churn_probability": round(float(churn_proba), 4),
            "threshold": 0.5,
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/")
def root():
    return {"message": "Churn prediction API is running!"}
