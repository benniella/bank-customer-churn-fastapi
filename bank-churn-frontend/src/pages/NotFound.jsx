import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-[#0C2E8A]">404</h1>
      <p className="text-lg text-gray-600 mt-4">Page Not Found</p>
      <Link to="/" className="mt-6 bg-[#0C2E8A] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
