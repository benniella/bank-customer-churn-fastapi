import React, { useState } from "react";
import { predictChurn } from "../utils/api";

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
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictChurn({
        ...formData,
        CreditScore: Number(formData.CreditScore),
        Gender: Number(formData.Gender),
        Age: Number(formData.Age),
        Tenure: Number(formData.Tenure),
        Balance: Number(formData.Balance),
        NumOfProducts: Number(formData.NumOfProducts),
        HasCrCard: Number(formData.HasCrCard),
        IsActiveMember: Number(formData.IsActiveMember),
        EstimatedSalary: Number(formData.EstimatedSalary),
      });

      if (data.prediction === "Error") throw new Error("Prediction failed");
      setResult(data);
    } catch (err) {
      setError("⚠️ Could not get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Bank Customer Churn Prediction
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Credit Score */}
        <div>
          <label className="block font-medium text-gray-700">Credit Score</label>
          <input
            type="number"
            name="CreditScore"
            value={formData.CreditScore}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium text-gray-700">Gender</label>
          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="block font-medium text-gray-700">Tenure (Years)</label>
          <input
            type="number"
            name="Tenure"
            value={formData.Tenure}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Balance */}
        <div>
          <label className="block font-medium text-gray-700">Balance</label>
          <input
            type="number"
            name="Balance"
            value={formData.Balance}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Number of Products */}
        <div>
          <label className="block font-medium text-gray-700">
            Number of Products
          </label>
          <input
            type="number"
            name="NumOfProducts"
            value={formData.NumOfProducts}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Has Credit Card */}
        <div>
          <label className="block font-medium text-gray-700">Has Credit Card</label>
          <select
            name="HasCrCard"
            value={formData.HasCrCard}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Active Member */}
        <div>
          <label className="block font-medium text-gray-700">Active Member</label>
          <select
            name="IsActiveMember"
            value={formData.IsActiveMember}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Estimated Salary */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700">
            Estimated Salary
          </label>
          <input
            type="number"
            name="EstimatedSalary"
            value={formData.EstimatedSalary}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Geography */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700">Geography</label>
          <select
            name="Geography"
            value={formData.Geography}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Country</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex justify-center items-center"
          >
            {loading ? (
              <span className="loader ease-linear rounded-full border-4 border-t-4 border-white h-6 w-6 animate-spin"></span>
            ) : (
              "Predict Churn"
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {error && (
        <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
      )}
      {result && !error && (
        <div className="mt-8 text-center bg-gray-50 border rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Prediction Result
          </h3>
          <p className="text-gray-700">
            <span className="font-semibold">Prediction:</span>{" "}
            {result.prediction}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Churn Probability:</span>{" "}
            {(result.churn_probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
