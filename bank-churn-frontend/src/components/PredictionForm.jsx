import React, { useState } from "react";
import axios from "axios";

function PredictionForm({ setPrediction }) {
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    const payload = {
      CreditScore: Number(formData.CreditScore),
      Gender: Number(formData.Gender),
      Age: Number(formData.Age),
      Tenure: Number(formData.Tenure),
      Balance: parseFloat(formData.Balance),
      NumOfProducts: Number(formData.NumOfProducts),
      HasCrCard: Number(formData.HasCrCard),
      IsActiveMember: Number(formData.IsActiveMember),
      EstimatedSalary: parseFloat(formData.EstimatedSalary),
      Geography: formData.Geography,
    };

    try {
      const res = await axios.post(
        "https://bank-customer-churn-fastapi.onrender.com/predict",
        payload
      );
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
      setPrediction("Error: Could not get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Bank Customer Churn Prediction
      </h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Score */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Credit Score
          </label>
          <input
            type="number"
            name="CreditScore"
            value={formData.CreditScore}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Gender
          </label>
          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Age
          </label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tenure (Years with Bank)
          </label>
          <input
            type="number"
            name="Tenure"
            value={formData.Tenure}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Balance
          </label>
          <input
            type="number"
            name="Balance"
            value={formData.Balance}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Num of Products */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Number of Products
          </label>
          <select
            name="NumOfProducts"
            value={formData.NumOfProducts}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Has Credit Card
          </label>
          <select
            name="HasCrCard"
            value={formData.HasCrCard}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Active Member */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Active Member
          </label>
          <select
            name="IsActiveMember"
            value={formData.IsActiveMember}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Estimated Salary
          </label>
          <input
            type="number"
            name="EstimatedSalary"
            value={formData.EstimatedSalary}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Geography */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Geography
          </label>
          <select
            name="Geography"
            value={formData.Geography}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 w-full md:w-auto bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              <span>Predicting...</span>
            </div>
          ) : (
            "Get Prediction"
          )}
        </button>
      </div>
    </form>
  );
}

export default PredictionForm;
