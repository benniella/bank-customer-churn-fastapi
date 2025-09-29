export default function About() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">About This Project</h2>
      <p className="text-gray-600 mb-4">
        This is a machine learning project that predicts whether a bank customer will churn.
        It uses a FastAPI backend and a modern React + Tailwind frontend.
      </p>
      <p className="text-gray-600">
        Built to demonstrate technical skills in frontend development, API integration,
        and user-friendly design.
      </p>
    </section>
  );
}
