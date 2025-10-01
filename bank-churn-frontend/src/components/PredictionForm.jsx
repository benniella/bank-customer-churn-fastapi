// src/components/PredictionForm.jsx
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
  const [localResult, setLocalResult] = useState(null); // used if setPrediction not provided
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const data = await predictChurn(payload, { signal: controller.signal });

      // Pass to parent or show locally
      if (typeof setPrediction === "function") {
        setPrediction(data);
        navigate("/results");
      } else {
        setLocalResult(data);
      }
    } catch (err) {
      const msg = err?.message || "Unable to get prediction";
      setServerError(msg);
      // If parent expects a response on /results, send an error object
      if (typeof setPrediction === "function") {
        setPrediction({ error: msg });
        navigate("/results");
      }
    } finally {
      clearTimeout(timeout);
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Bank Customer Churn Prediction</h1>
        <p className="text-sm text-slate-500 mt-1">Fill the form below and get a churn probability.</p>
      </header>

      {serverError && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Credit Score"
          name="CreditScore"
          value={form.CreditScore}
          onChange={handleChange}
          type="number"
          min={0}
          error={errors.CreditScore}
          required
        />

        <Select
          label="Gender"
          name="Gender"
          value={form.Gender}
          onChange={handleChange}
          options={[
            { value: "", label: "Select gender" },
            { value: "1", label: "Male" },
            { value: "0", label: "Female" },
          ]}
          error={errors.Gender}
          required
        />

        <Input label="Age" name="Age" value={form.Age} onChange={handleChange} type="number" min={0} error={errors.Age} required />

        <Input label="Tenure" name="Tenure" value={form.Tenure} onChange={handleChange} type="number" min={0} error={errors.Tenure} required />

        <Input label="Balance" name="Balance" value={form.Balance} onChange={handleChange} type="number" min={0} error={errors.Balance} required />

        <Input
          label="Number of Products"
          name="NumOfProducts"
          value={form.NumOfProducts}
          onChange={handleChange}
          type="number"
          min={0}
          error={errors.NumOfProducts}
          required
        />

        <Select
          label="Has Credit Card"
          name="HasCrCard"
          value={form.HasCrCard}
          onChange={handleChange}
          options={[
            { value: "", label: "Select" },
            { value: "1", label: "Yes" },
            { value: "0", label: "No" },
          ]}
          error={errors.HasCrCard}
          required
        />

        <Select
          label="Active Member"
          name="IsActiveMember"
          value={form.IsActiveMember}
          onChange={handleChange}
          options={[
            { value: "", label: "Select" },
            { value: "1", label: "Yes" },
            { value: "0", label: "No" },
          ]}
          error={errors.IsActiveMember}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Estimated Salary"
            name="EstimatedSalary"
            value={form.EstimatedSalary}
            onChange={handleChange}
            type="number"
            min={0}
            error={errors.EstimatedSalary}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Select
            label="Geography"
            name="Geography"
            value={form.Geography}
            onChange={handleChange}
            options={[
              { value: "", label: "Select country" },
              { value: "France", label: "France" },
              { value: "Spain", label: "Spain" },
              { value: "Germany", label: "Germany" },
            ]}
            error={errors.Geography}
            required
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between space-x-4 mt-2">
          <div className="flex-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 px-5 rounded-lg shadow-sm transition"
              aria-disabled={loading}
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                </svg>
              )}
              <span>{loading ? "Predicting..." : "Predict Churn"}</span>
            </button>
          </div>

          <div className="w-36 flex-shrink-0">
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-50 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* inline result if parent didn't handle navigation */}
      {localResult && (
        <div className="mt-6 p-4 bg-slate-50 border rounded">
          <div className="text-sm text-slate-600">Churn probability</div>
          <div className="text-2xl font-semibold text-slate-800">{localResult.churn_probability}</div>
          <div className="mt-2 text-sm">Prediction: <strong>{localResult.prediction}</strong></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small presentational controls ---------- */

function Input({ label, name, value, onChange, type = "text", error, min, required }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700 flex justify-between">
        <span>{label}</span>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        min={min}
        aria-invalid={!!error}
        aria-required={required}
        className={`mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error ? "border-red-200 bg-red-50" : "border-slate-200"}`}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options = [], error, required }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700 flex justify-between">
        <span>{label}</span>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-required={required}
        className={`mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error ? "border-red-200 bg-red-50" : "border-slate-200"}`}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
