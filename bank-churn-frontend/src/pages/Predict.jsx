import PredictionForm from "../components/PredictionForm";

export default function Predict() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
        Enter Customer Details
      </h2>
      <PredictionForm />
    </section>
  );
}
