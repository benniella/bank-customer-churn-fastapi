from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import numpy as np

# Define input schema
class CustomerFeatures(BaseModel):
    credit_score: int = Field(..., ge=300, le=850)
    age: int = Field(..., ge=18, le=100)
    tenure: int = Field(..., ge=0, le=10)
    balance: float = Field(..., ge=0)
    products_number: int = Field(..., ge=1, le=4)
    credit_card: int = Field(..., ge=0, le=1)
    active_member: int = Field(..., ge=0, le=1)
    estimated_salary: float = Field(..., ge=0)
    gender: int = Field(..., ge=0, le=1)
    country: str

# Load model
try:
    model = joblib.load("models/model.pkl")
    BEST_THRESHOLD = 0.57
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None
    BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!", "status": "healthy"}

@app.post("/predict")
def predict(features: CustomerFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Build DataFrame with explicit types
        data = {
            'credit_score': np.int64(features.credit_score),
            'age': np.int64(features.age),
            'tenure': np.int64(features.tenure),
            'balance': np.float64(features.balance),
            'products_number': np.int64(features.products_number),
            'credit_card': np.int64(features.credit_card),
            'active_member': np.int64(features.active_member),
            'estimated_salary': np.float64(features.estimated_salary),
            'gender': np.int64(features.gender),
            'country': features.country
        }
        
        X = pd.DataFrame([data])
        
        print(f"DataFrame dtypes: {X.dtypes.to_dict()}")
        
        # Predict
        proba = float(model.predict_proba(X)[0, 1])
        prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"
        
        return {
            "prediction": prediction,
            "churn_probability": round(proba, 3),
            "threshold": BEST_THRESHOLD
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))