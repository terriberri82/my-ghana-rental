import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user } = useAuth();

  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-emerald-600">
        My Ghana Rental
      </Link>

      <div className="flex gap-6 items-center text-sm">
        <Link to="/" className="text-gray-700 hover:text-emerald-600">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-emerald-600">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-emerald-600">Contact</Link>

        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            {user.firstName} {user.lastName}
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-emerald-600">Login</Link>
            <Link
              to="/signup"
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;