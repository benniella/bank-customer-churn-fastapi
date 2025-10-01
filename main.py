from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# Load model
model = joblib.load("models/model.pkl")  # ✅ Pick one format (pkl or joblib)

# Threshold
BEST_THRESHOLD = 0.57  # ✅ Pick one threshold

# Initialize FastAPI app
app = FastAPI(title="Churn Prediction API")

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class CustomerData(BaseModel):
    CreditScore: float
    Gender: int
    Age: float
    Tenure: float
    Balance: float
    NumOfProducts: float
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float
    Geography: str

@app.get("/")
def home():
    return {"message": "Churn Prediction API is running!"}

@app.post("/predict")
def predict(data: CustomerData):
    X = pd.DataFrame([{
        "CreditScore": data.CreditScore,
        "Gender": data.Gender,
        "Age": data.Age,
        "Tenure": data.Tenure,
        "Balance": data.Balance,
        "NumOfProducts": data.NumOfProducts,
        "HasCrCard": data.HasCrCard,
        "IsActiveMember": data.IsActiveMember,
        "EstimatedSalary": data.EstimatedSalary,
        "Geography": data.Geography
    }])

    # Get churn probability
    proba = model.predict_proba(X)[:, 1][0]

    # Apply threshold
    prediction = int(proba >= BEST_THRESHOLD)

    return {
        "churn_probability": round(float(proba), 3),
        "prediction": "Churn" if prediction == 1 else "Stay"
    }
