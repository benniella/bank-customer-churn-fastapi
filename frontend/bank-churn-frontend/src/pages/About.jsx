export default function About() {
  return (
    <section className="text-center py-16 px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gold-400 mb-6">
          About the Bank Churn Prediction Model
        </h2>

        {/* Short Description */}
        <p className="text-lg text-black-300 leading-relaxed">
          The Bank Customer Churn Prediction Model is a machine learning system
          designed to estimate the likelihood that a customer will leave (churn)
          a bank based on their profile and account behavior. <br /> <br /> Using real-world
          financial data, the model analyzes key customer attributes such as
          credit score, age, account balance, number of products, card
          ownership, activity status, and location to generate a churn
          probability score between 0 and 1. <br /> <br /> A higher score (closer to 1) 
          indicates that the customer is more likely to churn.  <br />A lower score
          (closer to 0) suggests that the customer is likely to remain with the
          bank. <br /> <br />The model was developed, trained, and deployed using Python,
          FastAPI, and machine learning algorithms to simulate a real-world
          banking risk analytics solution. It serves as an intelligent
          decision-support tool for banks aiming to improve customer retention
          strategies and reduce churn-related losses.
        </p>
      </div>
    </section>
  );
}
