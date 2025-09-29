import { useState } from "react";
import axios from "axios";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    CreditScore: "",
    Gender: "",
    Age: "",
    Tenure: "",
    Balance: "",
    NumOfProducts: "",
    HasCrCard: "",
    IsActiveMember: "",
    EstimatedSalary: "",
    Geography: "",
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://bank-customer-churn-fastapi.onrender.com/predict", formData);
      setPrediction(res.data);
    } catch (error) {
      console.error("Error predicting:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-full bg-blue-900 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-900 rounded-lg text-center font-semibold">
          Prediction: {prediction}
        </div>
      )}
    </div>
  );
}
