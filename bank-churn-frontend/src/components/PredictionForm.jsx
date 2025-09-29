import { useState } from "react";
import { predictChurn } from "../utils/api";
import ResultCard from "./ResultCard";

function PredictionForm() {
  const [formData, setFormData] = useState({
    CreditScore: "",
    Gender: 0,
    Age: "",
    Tenure: "",
    Balance: "",
    NumOfProducts: "",
    HasCrCard: 0,
    IsActiveMember: 0,
    EstimatedSalary: "",
    Geography: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await predictChurn(formData);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-[#0C2E8A] mb-6 text-center">
        Enter Customer Details
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">{key}</label>
            <input
              type={typeof formData[key] === "number" ? "number" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0C2E8A]"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="col-span-1 md:col-span-2 bg-[#0C2E8A] text-white py-3 rounded-md hover:bg-blue-900 transition disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default PredictionForm;
