import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container mx-auto text-center py-20 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        Bank Customer Churn Prediction
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Predict whether a customer will leave the bank using our AI-powered tool.
      </p>
      <Link
        to="/predict"
        className="px-6 py-3 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
      >
        Get Started
      </Link>
    </section>
  );
}
