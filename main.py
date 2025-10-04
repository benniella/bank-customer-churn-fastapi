from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib

# Define input schema
class CustomerFeatures(BaseModel):
    credit_score: int = Field(..., ge=300, le=850, description="Credit score")
    age: int = Field(..., ge=18, le=100, description="Age")
    tenure: int = Field(..., ge=0, le=10, description="Tenure in years")
    balance: float = Field(..., ge=0, description="Account balance")
    products_number: int = Field(..., ge=1, le=4, description="Number of products")
    credit_card: int = Field(..., ge=0, le=1, description="Has credit card (0 or 1)")
    active_member: int = Field(..., ge=0, le=1, description="Is active member (0 or 1)")
    estimated_salary: float = Field(..., ge=0, description="Estimated salary")
    gender: int = Field(..., ge=0, le=1, description="Gender: 0=Female, 1=Male")
    country: str = Field(..., description="Country")

    class Config:
        json_schema_extra = {
            "example": {
                "credit_score": 650,
                "age": 35,
                "tenure": 5,
                "balance": 50000.0,
                "products_number": 2,
                "credit_card": 1,
                "active_member": 1,
                "estimated_salary": 75000.0,
                "gender": 1,
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

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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
        # Convert input to dict
        data_dict = features.dict()
        
        # Explicitly create DataFrame with correct types to avoid pandas type inference issues
        X = pd.DataFrame([{
            'credit_score': int(data_dict['credit_score']),
            'age': int(data_dict['age']),
            'tenure': int(data_dict['tenure']),
            'balance': float(data_dict['balance']),
            'products_number': int(data_dict['products_number']),
            'credit_card': int(data_dict['credit_card']),
            'active_member': int(data_dict['active_member']),
            'estimated_salary': float(data_dict['estimated_salary']),
            'gender': int(data_dict['gender']),
            'country': str(data_dict['country'])
        }])
        
        print(f"Input data: {data_dict}")
        print(f"DataFrame:\n{X}")
        print(f"DataFrame dtypes:\n{X.dtypes}")
        
        # Predict churn probability
        proba = model.predict_proba(X)[:, 1][0]
        prediction = "Churn" if proba >= BEST_THRESHOLD else "Not Churn"

        result = {
            "prediction": prediction,
            "churn_probability": round(float(proba), 3),
            "threshold": BEST_THRESHOLD
        }
        
        print(f"Prediction result: {result}")
        
        return result
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Prediction error: {str(e)}")
        print(f"Full traceback: {error_trace}")
        raise HTTPException(
            status_code=500, 
            detail=f"Prediction error: {str(e)}"
        )

@app.options("/predict")
async def options_predict():
    return {"message": "OK"}