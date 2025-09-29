import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#0C2E8A] text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-xl font-bold">Churn Predictor</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/predict" className="hover:text-gray-300">Predict</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
