import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  function handleLogout() {
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  }

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

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-emerald-600"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-emerald-600">
              Login
            </Link>
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
