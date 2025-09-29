import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          BankChurn AI
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/predict" className="hover:text-gray-200">Predict</Link>
          <Link to="/results" className="hover:text-gray-200">Results</Link>
          <Link to="/about" className="hover:text-gray-200">About</Link>
        </div>
      </div>
    </nav>
  );
}
