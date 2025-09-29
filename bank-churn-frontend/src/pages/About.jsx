function About() {
  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-[#0C2E8A] mb-4">About This Project</h2>
      <p className="text-gray-600 text-lg mb-6">
        This project demonstrates a machine learning model deployed with FastAPI 
        to predict customer churn for a bank. The frontend is built with React 
        and Tailwind CSS to provide a clean, modern interface.
      </p>
      <p className="text-gray-500">
        Built by [Your Sister’s Name] for technical interview purposes.
      </p>
    </section>
  );
}

export default About;
