import React, { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const res = await axios.post(
        "https://bank-customer-churn-fastapi.onrender.com/predict",
        formData
      );
      setPrediction(res.data);
    } catch (error) {
      setPrediction("Error: Could not get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Bank Churn Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credit Score */}
        <div>
          <label className="block mb-2 font-medium">Credit Score</label>
          <input
            type="number"
            name="CreditScore"
            value={formData.CreditScore}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Gender Dropdown */}
        <div>
          <label className="block mb-2 font-medium">Gender</label>
          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="0">Female</option>
            <option value="1">Male</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block mb-2 font-medium">Age</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="block mb-2 font-medium">Tenure (years)</label>
          <input
            type="number"
            name="Tenure"
            value={formData.Tenure}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Balance */}
        <div>
          <label className="block mb-2 font-medium">Balance</label>
          <input
            type="number"
            name="Balance"
            value={formData.Balance}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Number of Products */}
        <div>
          <label className="block mb-2 font-medium">Number of Products</label>
          <select
            name="NumOfProducts"
            value={formData.NumOfProducts}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">1 Product</option>
            <option value="2">2 Products</option>
            <option value="3">3 Products</option>
            <option value="4">4 Products</option>
          </select>
        </div>

        {/* Has Credit Card */}
        <div>
          <label className="block mb-2 font-medium">Has Credit Card</label>
          <select
            name="HasCrCard"
            value={formData.HasCrCard}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Active Member */}
        <div>
          <label className="block mb-2 font-medium">Active Member</label>
          <select
            name="IsActiveMember"
            value={formData.IsActiveMember}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Estimated Salary */}
        <div>
          <label className="block mb-2 font-medium">Estimated Salary</label>
          <input
            type="number"
            name="EstimatedSalary"
            value={formData.EstimatedSalary}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Geography */}
        <div>
          <label className="block mb-2 font-medium">Geography</label>
          <select
            name="Geography"
            value={formData.Geography}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Country</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Predicting...
            </span>
          ) : (
            "Predict"
          )}
        </button>
      </form>

      {/* Result */}
      {prediction && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">Result</h3>
          <p className="mt-2 text-blue-600 font-semibold">{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
