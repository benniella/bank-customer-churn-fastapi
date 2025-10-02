import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictChurn } from "../utils/api.js";

const INITIAL = {
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
    if (!values.CreditScore && values.CreditScore !== 0) e.CreditScore = "Required";
    if (values.Gender !== "0" && values.Gender !== "1") e.Gender = "Select gender";
    if (!values.Age && values.Age !== 0) e.Age = "Required";
    if (values.Tenure === "") e.Tenure = "Required";
    if (values.Balance === "") e.Balance = "Required";
    if (values.NumOfProducts === "") e.NumOfProducts = "Required";
    if (values.HasCrCard !== "0" && values.HasCrCard !== "1") e.HasCrCard = "Select";
    if (values.IsActiveMember !== "0" && values.IsActiveMember !== "1") e.IsActiveMember = "Select";
    if (values.EstimatedSalary === "") e.EstimatedSalary = "Required";
    if (!values.Geography) e.Geography = "Select geography";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const buildPayload = (values) => ({
    CreditScore: Number(values.CreditScore),
    Gender: Number(values.Gender),
    Age: Number(values.Age),
    Tenure: Number(values.Tenure),
    Balance: Number(values.Balance),
    NumOfProducts: Number(values.NumOfProducts),
    HasCrCard: Number(values.HasCrCard),
    IsActiveMember: Number(values.IsActiveMember),
    EstimatedSalary: Number(values.EstimatedSalary),
    Geography: values.Geography,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = buildPayload(form);

    setLoading(true);
    try {
      const data = await predictChurn(payload);

      if (typeof setPrediction === "function") {
        setPrediction(data);
        navigate("/results");
      } else {
        setLocalResult(data);
      }
    } catch (err) {
      const msg = err?.message || "Unable to get prediction";
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
    <div className="max-w-4xl mx-auto bg-black border border-gold-600 shadow-xl rounded-2xl p-10 mt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gold-500">
          Bank Customer Churn Prediction
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Fill the form below and get a churn probability.
        </p>
      </header>

      {serverError && (
        <div role="alert" className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Credit Score" name="CreditScore" value={form.CreditScore} onChange={handleChange} type="number" error={errors.CreditScore} />
        <Select label="Gender" name="Gender" value={form.Gender} onChange={handleChange}
          options={[{ value: "", label: "Select gender" }, { value: "1", label: "Male" }, { value: "0", label: "Female" }]} error={errors.Gender} />
        <Input label="Age" name="Age" value={form.Age} onChange={handleChange} type="number" error={errors.Age} />
        <Input label="Tenure" name="Tenure" value={form.Tenure} onChange={handleChange} type="number" error={errors.Tenure} />
        <Input label="Balance" name="Balance" value={form.Balance} onChange={handleChange} type="number" error={errors.Balance} />
        <Input label="Number of Products" name="NumOfProducts" value={form.NumOfProducts} onChange={handleChange} type="number" error={errors.NumOfProducts} />
        <Select label="Has Credit Card" name="HasCrCard" value={form.HasCrCard} onChange={handleChange}
          options={[{ value: "", label: "Select" }, { value: "1", label: "Yes" }, { value: "0", label: "No" }]} error={errors.HasCrCard} />
        <Select label="Active Member" name="IsActiveMember" value={form.IsActiveMember} onChange={handleChange}
          options={[{ value: "", label: "Select" }, { value: "1", label: "Yes" }, { value: "0", label: "No" }]} error={errors.IsActiveMember} />
        <Input label="Estimated Salary" name="EstimatedSalary" value={form.EstimatedSalary} onChange={handleChange} type="number" error={errors.EstimatedSalary} className="md:col-span-2" />
        <Select label="Geography" name="Geography" value={form.Geography} onChange={handleChange}
          options={[{ value: "", label: "Select country" }, { value: "France", label: "France" }, { value: "Spain", label: "Spain" }, { value: "Germany", label: "Germany" }]} error={errors.Geography} className="md:col-span-2" />
        <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-gold-500 text-black font-semibold rounded-xl hover:bg-gold-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-60">
            {loading ? "Predicting..." : "Predict Churn"}
          </button>
          <button type="button" onClick={resetForm} className="w-full md:w-auto px-8 py-3 border border-gold-600 text-gold-400 rounded-xl hover:bg-black-800 transition">
            Reset
          </button>
        </div>
      </form>

      {localResult && (
        <div className="mt-8 p-4 bg-black border border-gold-700 rounded-lg text-gold-400">
          <div className="text-sm">Churn probability</div>
          <div className="text-2xl font-bold">{localResult.churn_probability}</div>
          <div className="mt-2 text-sm">Prediction: <strong>{localResult.prediction}</strong></div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", error }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-300 flex justify-between">
        <span>{label}</span>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`mt-2 w-full p-3 rounded-xl bg-black text-gold-400 border ${error ? "border-red-600" : "border-gold-600"} focus:ring-2 focus:ring-gold-400 focus:outline-none`}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [], error }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-300 flex justify-between">
        <span>{label}</span>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-2 w-full p-3 rounded-xl bg-black text-gold-400 border ${error ? "border-red-600" : "border-gold-600"} focus:ring-2 focus:ring-gold-400 focus:outline-none`}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
