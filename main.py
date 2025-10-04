from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib

# Define input schema - EXACTLY matching API docs
class CustomerFeatures(BaseModel):
    credit_score: int = Field(..., description="Credit score")
    age: int = Field(..., description="Age")
    tenure: int = Field(..., description="Tenure in years")
    balance: float = Field(..., description="Account balance")
    products_number: int = Field(..., description="Number of products")
    credit_card: str = Field(..., description="Has credit card (string: '0' or '1')")
    active_member: str = Field(..., description="Is active member (string: '0' or '1')")
    estimated_salary: float = Field(..., description="Estimated salary")
    gender: str = Field(..., description="Gender (string: '0' or '1')")
    country: str = Field(..., description="Country")

    class Config:
        json_schema_extra = {
            "example": {
                "credit_score": 650,
                "age": 35,
                "tenure": 5,
                "balance": 50000.0,
                "products_number": 2,
                "credit_card": "1",
                "active_member": "1",
                "estimated_salary": 75000.0,
                "gender": "1",
                "country": "France"
            }
        }

# Load model
try:
    model = joblib.load("models/model.pkl")
    BEST_THRESHOLD = 0.57
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None
    BEST_THRESHOLD = 0.57

# Create FastAPI app
app = FastAPI(
    title="Churn Prediction API",
    description="API for predicting customer churn probability",
    version="0.1.0"
)

# CRITICAL: CORS must be added BEFORE routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

@app.get("/")
def home():
    return {
        "message": "Churn Prediction API is running!",
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "threshold": BEST_THRESHOLD
    }

@app.post("/predict")
def predict(features: CustomerFeatures):
    if model is None:
        raise HTTPException(
            status_code=500, 
            detail="Model not loaded. Please contact administrator."
        )
    
    try:
        # Convert input to DataFrame
        data_dict = features.dict()
        X = pd.DataFrame([data_dict])
        
        print(f"Input data: {data_dict}")  # Debug log
        
        # Predict churn probability
        proba = model.predict_proba(X)[:, 1][0]
        prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"

        result = {
            "prediction": prediction,
            "churn_probability": round(float(proba), 3),
            "threshold": BEST_THRESHOLD
        }
        
        print(f"Prediction result: {result}")  # Debug log
        
        return result
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500, 
            detail=f"Prediction error: {str(e)}"
        )

# Add explicit OPTIONS handler for CORS preflight
@app.options("/predict")
async def options_predict():
    return {"message": "OK"}