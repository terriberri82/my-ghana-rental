import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-emerald-600">
        My Ghana Rental
      </Link>

      <div className="flex gap-6 items-center text-sm">
        <Link to="/" className="text-gray-700 hover:text-emerald-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-emerald-600">
          About
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-emerald-600">
          Contact
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-emerald-600">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
