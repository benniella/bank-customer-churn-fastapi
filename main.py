from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib

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
        # Create DataFrame with EXACT column order and names the model expects
        # Note: Model expects both 'gender' AND 'Gender' (duplicate column from training)
        X = pd.DataFrame([{
            'credit_score': features.credit_score,
            'country': features.country,
            'gender': features.gender,
            'age': features.age,
            'tenure': features.tenure,
            'balance': features.balance,
            'products_number': features.products_number,
            'credit_card': features.credit_card,
            'active_member': features.active_member,
            'estimated_salary': features.estimated_salary,
            'Gender': features.gender  # Duplicate column with capital G
        }])
        
        print(f"DataFrame columns: {X.columns.tolist()}")
        print(f"DataFrame shape: {X.shape}")
        
        # Predict
        proba = model.predict_proba(X)[:, 1][0]
        prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"
        
        return {
            "prediction": prediction,
            "churn_probability": round(float(proba), 3),
            "threshold": BEST_THRESHOLD
        }
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))