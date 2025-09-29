import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50">
      <h1 className="text-4xl md:text-6xl font-bold text-[#0C2E8A] mb-6">
        Bank Customer Churn Prediction
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        Use machine learning to predict whether a customer will stay or leave. 
        Enter customer details and get instant predictions.
      </p>
      <Link 
        to="/predict" 
        className="bg-[#0C2E8A] text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-900 transition"
      >
        Get Started
      </Link>
    </section>
  );
}

export default Home;
