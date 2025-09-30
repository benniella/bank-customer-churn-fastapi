import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictChurn } from "../utils/api";

const PredictionForm = ({ setPrediction }) => {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        CreditScore: parseFloat(formData.CreditScore),
        Age: parseFloat(formData.Age),
        Tenure: parseFloat(formData.Tenure),
        Balance: parseFloat(formData.Balance),
        NumOfProducts: parseFloat(formData.NumOfProducts),
        HasCrCard: parseInt(formData.HasCrCard),
        IsActiveMember: parseInt(formData.IsActiveMember),
        EstimatedSalary: parseFloat(formData.EstimatedSalary),
      };

      const predictionData = await predictChurn(data);
      setPrediction(predictionData);
      navigate("/results");
    } catch (error) {
      setPrediction({ error: "Could not get prediction" });
      navigate("/results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Bank Customer Churn Prediction
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Credit Score" name="CreditScore" value={formData.CreditScore} handleChange={handleChange} type="number" />
        <SelectField label="Gender" name="Gender" value={formData.Gender} handleChange={handleChange} options={[
          { value: "", label: "Select Gender" },
          { value: "1", label: "Male" },
          { value: "0", label: "Female" }
        ]} />
        <InputField label="Age" name="Age" value={formData.Age} handleChange={handleChange} type="number" />
        <InputField label="Tenure" name="Tenure" value={formData.Tenure} handleChange={handleChange} type="number" />
        <InputField label="Balance" name="Balance" value={formData.Balance} handleChange={handleChange} type="number" />
        <InputField label="Number of Products" name="NumOfProducts" value={formData.NumOfProducts} handleChange={handleChange} type="number" />
        <SelectField label="Has Credit Card" name="HasCrCard" value={formData.HasCrCard} handleChange={handleChange} options={[
          { value: "", label: "Select" },
          { value: "1", label: "Yes" },
          { value: "0", label: "No" }
        ]} />
        <SelectField label="Active Member" name="IsActiveMember" value={formData.IsActiveMember} handleChange={handleChange} options={[
          { value: "", label: "Select" },
          { value: "1", label: "Yes" },
          { value: "0", label: "No" }
        ]} />
        <InputField label="Estimated Salary" name="EstimatedSalary" value={formData.EstimatedSalary} handleChange={handleChange} type="number" className="md:col-span-2" />
        <SelectField label="Geography" name="Geography" value={formData.Geography} handleChange={handleChange} options={[
          { value: "", label: "Select Country" },
          { value: "France", label: "France" },
          { value: "Spain", label: "Spain" },
          { value: "Germany", label: "Germany" }
        ]} className="md:col-span-2" />

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex justify-center items-center"
          >
            {loading ? (
              <span className="loader ease-linear rounded-full border-4 border-t-4 border-white h-6 w-6 animate-spin"></span>
            ) : (
              "Predict Churn"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, handleChange, type, className }) => (
  <div className={className}>
    <label className="font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
);

const SelectField = ({ label, name, value, handleChange, options, className }) => (
  <div className={className}>
    <label className="font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={handleChange}
      className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
      required
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default PredictionForm;
