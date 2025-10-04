import os
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===== FastAPI app =====
app = FastAPI(title="Churn Prediction API", version="0.1.0")

# ===== CORS Middleware =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Load Model =====
MODEL_PATH = os.path.join("models", "model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# ===== Request Schema =====
class CustomerData(BaseModel):
    credit_score: float
    country: str
    gender: str
    age: int
    tenure: int
    balance: float
    products_number: int
    credit_card: int
    active_member: int
    estimated_salary: float


# ===== Simplified Preprocessing =====
def preprocess_input(data: CustomerData):
    """Return raw DataFrame — model handles its own preprocessing."""
    df = pd.DataFrame([data.dict()])
    return df


# ===== Prediction Endpoint =====
@app.post("/predict")
async def predict(data: CustomerData):
    if model is None:
        return {"error": "Model not loaded correctly."}

    try:
        processed = preprocess_input(data)
        prediction = model.predict(processed)
        probability = model.predict_proba(processed).tolist()[0]
        return {
            "prediction": int(prediction[0]),
            "probability": probability
        }
    except Exception as e:
        return {"error": str(e)}


# ===== Root Endpoint =====
@app.get("/")
async def root():
    return {"message": "Churn Prediction API is running 🚀"}
