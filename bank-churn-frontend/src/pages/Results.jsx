import React from "react";

const Results = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-400">No prediction made yet.</p>
      </div>
    );
  }

  if (prediction.error) {
    return (
      <div className="max-w-xl mx-auto bg-red-900 border border-red-700 text-red-200 p-6 rounded-2xl shadow-xl mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{prediction.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-black-900 shadow-2xl rounded-3xl p-10 mt-10 border border-gold-700">
      <h2 className="text-3xl font-bold text-center text-gold-500 mb-8">
        Prediction Results
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-r from-gold-600 to-gold-500 p-6 rounded-2xl text-black font-semibold shadow-lg">
          <h3 className="text-xl mb-2">Prediction</h3>
          <p className="text-lg">{prediction.prediction || "No data available"}</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-xl mb-2">Churn Probability</h3>
          <p className="text-lg">
            {(prediction.churn_probability * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-gradient-to-r from-gray-700 to-black p-6 rounded-2xl text-gold-400 shadow-lg">
          <h3 className="text-xl mb-2">Prediction Threshold</h3>
          <p className="text-lg">{prediction.threshold || "0.57"}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
