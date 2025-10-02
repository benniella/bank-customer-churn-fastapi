# Bank Customer Churn Prediction FastAPI

This project is a **Machine Learning pipeline + FastAPI service** that predicts whether a bank customer is likely to churn (leave the bank).
It uses a **tuned Random Forest model** with a custom decision threshold (`0.57`) for better balance between precision and recall.

##Input Features
The API expects the following fields in the request JSON:

- `credit_score` (int) → Customer credit score  
- `age` (int) → Age of the customer  
- `tenure` (int) → Number of years the customer has stayed with the bank  
- `balance` (float) → Account balance  
- `products_number` (int) → Number of bank products the customer uses  
- `credit_card` (0 or 1) → Whether the customer has a credit card  
- `active_member` (0 or 1) → Whether the customer is an active member  
- `estimated_salary` (float) → Estimated salary of the customer  
- `gender` ("Male" or "Female") → Customer gender  
- `country` ("France", "Germany", or "Spain") → Customer country of residence  

##Pipeline Steps
Internally, the model performs the following steps:

1. **Preprocessing**
   - Standard scaling of numerical features  
   - One-hot encoding of categorical features (`gender`, `country`)  

2. **Model**
   - Random Forest Classifier  
   - Tuned hyperparameters using GridSearchCV  

3. **Prediction**
   - Produces churn probability (0–1)  
   - Applies custom threshold = 0.57  
   - Returns `"Churn"` or `"Not Churn"`  

#Project Structure
BankCustomerChurnPrediction/  
│── main.py              # FastAPI app  
│── models/  
│   └── model.pkl        # trained ML pipeline  
│── requirements.txt     # dependencies  
│── .gitignore  

## Installation (Local)
1. Clone the repository:
   git clone https://github.com/benniella/bank-customer-churn-fastapi.git
   cd bank-customer-churn-fastapi

2. Create a virtual environment:
   python3 -m venv venv
   source venv/bin/activate   # Mac/Linux
   venv\Scripts\activate    # Windows

3. Install dependencies:
   pip install -r requirements.txt

4. Run FastAPI locally:
   uvicorn main:app --reload

5. Open in browser:
   http://127.0.0.1:8000/doc

## API Endpoints

### Health Check
GET /

Response:
{"message": "Churn Prediction API is running!"}

### Predict Churn
POST /predict

Request Example:
{
  "credit_score": 650,
  "age": 40,
  "tenure": 5,
  "balance": 60000,
  "products_number": 2,
  "credit_card": 1,
  "active_member": 1,
  "estimated_salary": 50000,
  "gender": "Male",
  "country": "France"
}

Response Example:
{
  "prediction": "Churn",
  "churn_probability": 0.734,
  "threshold": 0.57
}

## Deployment
This project is deployed on **Render**:  
https://bank-customer-churn-fastapi.onrender.com/docs  

The frontend (bank-churn.bennytechhub.com) consumes this API.  

## Model Info
- Algorithm: Random Forest Classifier  
- Best Params:  
  - n_estimators=300  
  - max_depth=15  
  - min_samples_leaf=10  
  - max_features='sqrt'  
- ROC-AUC: ~0.86 on test set  
- Best threshold: 0.57  

## Author
**Benedicta Otibhor Okhunlun**  
- MSc Artificial Intelligence Holder (University of Stirling)  
- AI/ML Lead @ Stripeedge  
- portfolio.bennytechhub.com  
