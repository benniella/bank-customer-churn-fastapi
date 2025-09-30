import React from "react";

const Results = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">No prediction made yet.</p>
      </div>
    );
  }

  if (prediction.error) {
    return (
      <div className="max-w-xl mx-auto bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{prediction.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Prediction Results
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Prediction</h3>
          <p className="text-lg">{prediction.prediction || "No data available"}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Churn Probability</h3>
          <p className="text-lg">{(prediction.churn_probability * 100).toFixed(2)}%</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Prediction Threshold</h3>
          <p className="text-lg">{prediction.threshold || "0.3"}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
