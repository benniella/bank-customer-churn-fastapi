function ResultCard({ result }) {
  const isChurn = result.prediction === "Churn";

  return (
    <div className={`mt-6 p-6 rounded-lg shadow-md text-center ${isChurn ? "bg-red-100 border border-red-400" : "bg-green-100 border border-green-400"}`}>
      <h3 className={`text-2xl font-bold ${isChurn ? "text-red-700" : "text-green-700"}`}>
        {result.prediction}
      </h3>
      <p className="mt-2 text-lg text-gray-700">
        Probability: {(result.churn_probability * 100).toFixed(2)}%
      </p>
    </div>
  );
}

export default ResultCard;
