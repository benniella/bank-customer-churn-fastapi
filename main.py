from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

model = joblib.load("models/model.pkl")
BEST_THRESHOLD = 0.57

app = FastAPI(title="Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allows any origin in dev; change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
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

        proba = model.predict_proba(X)[:, 1][0]
        prediction = int(proba >= BEST_THRESHOLD)

        return {
            "churn_probability": round(float(proba), 3),
            "prediction": "Churn" if prediction == 1 else "Stay"
        }

    except Exception as e:
        return {"error": str(e)}
