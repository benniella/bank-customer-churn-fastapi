import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictChurn, wakeUpServer } from "../utils/api.js";

const INITIAL = {
  credit_score: "",
  gender: "",
  age: "",
  tenure: "",
  balance: "",
  products_number: "",
  credit_card: "",
  active_member: "",
  estimated_salary: "",
  country: "",
};

export default function PredictionForm({ setPrediction }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [localResult, setLocalResult] = useState(null);
  const navigate = useNavigate();

  const validate = (values) => {
    const e = {};
    
    // Credit score validation
    if (!values.credit_score || values.credit_score === "") {
      e.credit_score = "Required";
    } else if (Number(values.credit_score) < 300 || Number(values.credit_score) > 850) {
      e.credit_score = "Must be between 300-850";
    }
    
    // Gender validation
    if (values.gender !== "0" && values.gender !== "1") {
      e.gender = "Select gender";
    }
    
    // Age validation
    if (!values.age || values.age === "") {
      e.age = "Required";
    } else if (Number(values.age) < 18 || Number(values.age) > 100) {
      e.age = "Must be between 18-100";
    }
    
    // Tenure validation
    if (values.tenure === "") {
      e.tenure = "Required";
    } else if (Number(values.tenure) < 0 || Number(values.tenure) > 10) {
      e.tenure = "Must be between 0-10";
    }
    
    // Balance validation
    if (values.balance === "") {
      e.balance = "Required";
    } else if (Number(values.balance) < 0) {
      e.balance = "Must be positive";
    }
    
    // Products number validation
    if (values.products_number === "") {
      e.products_number = "Required";
    } else if (Number(values.products_number) < 1 || Number(values.products_number) > 4) {
      e.products_number = "Must be between 1-4";
    }
    
    // Credit card validation
    if (values.credit_card !== "0" && values.credit_card !== "1") {
      e.credit_card = "Select an option";
    }
    
    // Active member validation
    if (values.active_member !== "0" && values.active_member !== "1") {
      e.active_member = "Select an option";
    }
    
    // Estimated salary validation
    if (values.estimated_salary === "") {
      e.estimated_salary = "Required";
    } else if (Number(values.estimated_salary) < 0) {
      e.estimated_salary = "Must be positive";
    }
    
    // Country validation
    if (!values.country || values.country === "") {
      e.country = "Select country";
    }
    
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const buildPayload = (values) => ({
    active_member: parseInt(values.active_member, 10), // Convert to integer
    age: parseInt(values.age, 10),
    balance: parseFloat(values.balance),
    country: values.country,
    credit_card: parseInt(values.credit_card, 10), // Convert to integer
    credit_score: parseInt(values.credit_score, 10),
    estimated_salary: parseFloat(values.estimated_salary),
    gender: parseInt(values.gender, 10), // Convert to integer
    products_number: parseInt(values.products_number, 10),
    tenure: parseInt(values.tenure, 10),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setLocalResult(null);
    
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = buildPayload(form);
    
    console.log("Form values:", form);
    console.log("Built payload:", payload);
    console.log("Payload JSON:", JSON.stringify(payload, null, 2));

    setLoading(true);
    try {
      // First, wake up the server (important for Render free tier)
      console.log("Waking up server...");
      await wakeUpServer();
      console.log("Server ready, sending prediction request...");
      
      const data = await predictChurn(payload);
      console.log("Received data:", data); // Debug log

      if (typeof setPrediction === "function") {
        setPrediction(data);
        navigate("/results");
      } else {
        setLocalResult(data);
      }
    } catch (err) {
      console.error("Prediction error:", err); // Debug log
      const msg = err?.message || "Unable to get prediction. Please try again.";
      setServerError(msg);
      if (typeof setPrediction === "function") {
        setPrediction({ error: msg });
        navigate("/results");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL);
    setErrors({});
    setServerError("");
    setLocalResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-black border border-yellow-600 shadow-xl rounded-2xl p-10 mt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-500">
          Bank Customer Churn Prediction
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Fill the form below and get a churn probability prediction.
        </p>
        <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg text-blue-300 text-sm">
          ⏱️ <strong>Note:</strong> First prediction may take 30-60 seconds as the server wakes up (Render free tier limitation). Subsequent predictions will be faster.
        </div>
      </header>

      {serverError && (
        <div role="alert" className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
          <strong className="font-bold">Error: </strong>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Credit Score" 
          name="credit_score" 
          value={form.credit_score} 
          onChange={handleChange} 
          type="number" 
          error={errors.credit_score}
          min="300"
          max="850"
          placeholder="e.g., 650"
        />
        <Select 
          label="Gender" 
          name="gender" 
          value={form.gender} 
          onChange={handleChange}
          options={[
            { value: "", label: "Select gender" }, 
            { value: "1", label: "Male" }, 
            { value: "0", label: "Female" }
          ]} 
          error={errors.gender} 
        />
        <Input 
          label="Age" 
          name="age" 
          value={form.age} 
          onChange={handleChange} 
          type="number" 
          error={errors.age}
          min="18"
          max="100"
          placeholder="e.g., 35"
        />
        <Input 
          label="Tenure (Years)" 
          name="tenure" 
          value={form.tenure} 
          onChange={handleChange} 
          type="number" 
          error={errors.tenure}
          min="0"
          max="10"
          placeholder="e.g., 5"
        />
        <Input 
          label="Balance" 
          name="balance" 
          value={form.balance} 
          onChange={handleChange} 
          type="number" 
          step="0.01"
          error={errors.balance}
          min="0"
          placeholder="e.g., 50000.00"
        />
        <Input 
          label="Number of Products" 
          name="products_number" 
          value={form.products_number} 
          onChange={handleChange} 
          type="number" 
          error={errors.products_number}
          min="1"
          max="4"
          placeholder="e.g., 2"
        />
        <Select 
          label="Has Credit Card" 
          name="credit_card" 
          value={form.credit_card} 
          onChange={handleChange}
          options={[
            { value: "", label: "Select" }, 
            { value: "1", label: "Yes" }, 
            { value: "0", label: "No" }
          ]} 
          error={errors.credit_card} 
        />
        <Select 
          label="Active Member" 
          name="active_member" 
          value={form.active_member} 
          onChange={handleChange}
          options={[
            { value: "", label: "Select" }, 
            { value: "1", label: "Yes" }, 
            { value: "0", label: "No" }
          ]} 
          error={errors.active_member} 
        />
        <Input 
          label="Estimated Salary" 
          name="estimated_salary" 
          value={form.estimated_salary} 
          onChange={handleChange} 
          type="number" 
          step="0.01"
          error={errors.estimated_salary} 
          className="md:col-span-2"
          min="0"
          placeholder="e.g., 75000.00"
        />
        <Select 
          label="Country" 
          name="country" 
          value={form.country} 
          onChange={handleChange}
          options={[
            { value: "", label: "Select country" }, 
            { value: "France", label: "France" }, 
            { value: "Spain", label: "Spain" }, 
            { value: "Germany", label: "Germany" }
          ]} 
          error={errors.country} 
          className="md:col-span-2" 
        />
        <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto px-8 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Predicting... (This may take 30-60s)</span>
              </span>
            ) : "Predict Churn"}
          </button>
          <button 
            type="button" 
            onClick={resetForm} 
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 border border-yellow-600 text-yellow-400 rounded-xl hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </form>

      {localResult && (
        <div className="mt-8 p-6 bg-gray-900 border border-yellow-700 rounded-lg text-yellow-400">
          <h3 className="text-xl font-bold mb-4">Prediction Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400">Churn Probability</div>
              <div className="text-2xl font-bold">{(localResult.churn_probability * 100).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Prediction</div>
              <div className="text-2xl font-bold">{localResult.prediction}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Threshold</div>
              <div className="text-2xl font-bold">{localResult.threshold}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-sm font-medium text-gray-300 flex justify-between mb-2">
        <span>{label}</span>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`w-full p-3 rounded-xl bg-gray-900 text-yellow-400 border ${
          error ? "border-red-600" : "border-yellow-600"
        } focus:ring-2 focus:ring-yellow-400 focus:outline-none transition`}
        {...props}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [], error, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-sm font-medium text-gray-300 flex justify-between mb-2">
        <span>{label}</span>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-xl bg-gray-900 text-yellow-400 border ${
          error ? "border-red-600" : "border-yellow-600"
        } focus:ring-2 focus:ring-yellow-400 focus:outline-none transition`}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}