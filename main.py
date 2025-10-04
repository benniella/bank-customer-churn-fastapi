from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import numpy as np

class CustomerFeatures(BaseModel):
    credit_score: int
    age: int
    tenure: int
    balance: float
    products_number: int
    credit_card: int
    active_member: int
    estimated_salary: float
    gender: int
    country: str

try:
    model = joblib.load("models/model.pkl")
    BEST_THRESHOLD = 0.57
    print("✓ Model loaded")
    print(f"Model type: {type(model)}")
    print(f"Model attributes: {dir(model)}")
    
    # Try to get feature names if available
    if hasattr(model, 'feature_names_in_'):
        print(f"Expected features: {model.feature_names_in_}")
    if hasattr(model, 'n_features_in_'):
        print(f"Number of features: {model.n_features_in_}")
        
except Exception as e:
    print(f"✗ Error: {e}")
    model = None
    BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!"}

@app.post("/predict")
def predict(features: CustomerFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Create DataFrame - try both ways
        print("\n=== ATTEMPTING PREDICTION ===")
        
        # Method 1: Direct dict
        data_dict = {
            'credit_score': features.credit_score,
            'gender': features.gender,
            'age': features.age,
            'tenure': features.tenure,
            'balance': features.balance,
            'products_number': features.products_number,
            'credit_card': features.credit_card,
            'active_member': features.active_member,
            'estimated_salary': features.estimated_salary,
            'country': features.country
        }
        
        print(f"Input dict: {data_dict}")
        
        X = pd.DataFrame([data_dict])
        
        print(f"DataFrame shape: {X.shape}")
        print(f"DataFrame columns: {X.columns.tolist()}")
        print(f"DataFrame dtypes:\n{X.dtypes}")
        print(f"DataFrame values:\n{X.values}")
        print(f"DataFrame info:\n{X.info()}")
        
        # Try prediction
        print("\nAttempting predict_proba...")
        proba = model.predict_proba(X)
        print(f"Prediction successful! Proba shape: {proba.shape}")
        
        proba_value = float(proba[0, 1])
        prediction = "Churn" if proba_value >= BEST_THRESHOLD else "Not Churn"
        
        return {
            "prediction": prediction,
            "churn_probability": round(proba_value, 3),
            "threshold": BEST_THRESHOLD
        }
        
    except Exception as e:
        print(f"\n=== ERROR OCCURRED ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        
        import traceback
        full_trace = traceback.format_exc()
        print(f"Full traceback:\n{full_trace}")
        
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")