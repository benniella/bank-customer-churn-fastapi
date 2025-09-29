import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Results from "./components/ResultCard";
import About from "./pages/About";

function App() {
  // Global prediction state
  const [prediction, setPrediction] = useState(null);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Pass state down to Predict page */}
            <Route
              path="/predict"
              element={<Predict setPrediction={setPrediction} />}
            />

            {/* Results page shows the prediction */}
            <Route
              path="/results"
              element={<Results prediction={prediction} />}
            />

            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
