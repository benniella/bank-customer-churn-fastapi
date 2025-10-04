from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import traceback
import os

# ===== Model input schema =====
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

# Debug file system
print("Current directory:", os.getcwd())
print("Files:", os.listdir("."))
if os.path.exists("models"):
    print("Models folder:", os.listdir("models"))

# ===== Load model =====
try:
    model = joblib.load("models/model.pkl")
    BEST_THRESHOLD = 0.57
    print("✓ Model loaded successfully")
    
    if hasattr(model, 'feature_names_in_'):
        print(f"Expected features: {list(model.feature_names_in_)}")
    if hasattr(model, 'n_features_in_'):
        print(f"Number of features: {model.n_features_in_}")
    
except Exception as e:
    print(f"✗ Error loading model: {e}")
    traceback.print_exc()
    model = None
    BEST_THRESHOLD = 0.57

# ===== FastAPI app =====
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
    return {
        "message": "Churn Prediction API is running!", 
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
def predict(features: CustomerFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Build DataFrame with duplicate Gender column (model expects 11 features)
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

        print(f"Input columns: {X.columns.tolist()}")
        print(f"Input shape: {X.shape}")

        # Predict (model has built-in preprocessing)
        proba = float(model.predict_proba(X)[0, 1])
        prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"

        print(f"✓ Prediction: {prediction} ({proba:.3f})")

        return {
            "prediction": prediction,
            "churn_probability": round(proba, 3),
            "threshold": BEST_THRESHOLD
        }

    except Exception as e:
        print(f"✗ Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))