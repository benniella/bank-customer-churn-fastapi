
Bank Customer Churn Prediction API 🚀

A FastAPI machine learning service that predicts whether a bank customer will churn.
The API uses a trained Random Forest pipeline with preprocessing (scaling + encoding)
to serve real-time predictions.

🌍 Live Demo
Base URL: https://bank-customer-churn-fastapi.onrender.com
Swagger Docs: https://bank-customer-churn-fastapi.onrender.com/docs

📂 Project Structure
bank-customer-churn-fastapi/
│── models/              # Saved ML model (Git LFS)
│── main.py              # FastAPI application
│── requirements.txt     # Project dependencies
│── start.sh             # Startup script for Render

▶️ Running Locally
git clone https://github.com/benniella/bank-customer-churn-fastapi.git
cd bank-customer-churn-fastapi
pip install -r requirements.txt
uvicorn main:app --reload

Swagger UI available at http://127.0.0.1:8000/docs

📊 Example Prediction Request
POST /predict

Request:
{
  "CreditScore": 600,
  "Gender": 1,
  "Age": 45,
  "Tenure": 3,
  "Balance": 50000,
  "NumOfProducts": 2,
  "HasCrCard": 1,
  "IsActiveMember": 0,
  "EstimatedSalary": 60000,
  "Geography": "Germany"
}

Response:
{
  "churn_probability": 0.61,
  "prediction": "Churn",
  "threshold": 0.3
}

🛠️ Tech Stack
- Python 3.9
- FastAPI – API framework
- scikit-learn – ML pipeline
- NumPy & Pandas – data processing
- Joblib – model persistence
- Render – deployment
- Git LFS – model storage

👩‍💻 Author
Built by Benedicta Otibhor Okhunlun (https://github.com/benniella) ✨
