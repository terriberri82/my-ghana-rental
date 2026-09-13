import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const { pathname } = useLocation();

  const transparent =
    pathname === "/about" || pathname === "/login" || pathname === "/signup";

  const lightText = pathname === "/about" || pathname === "/signup";

  const linkClass =
    pathname === "/login"
      ? "text-ebony/75 hover:text-bayou md:text-paper md:hover:text-paper/70"
      : "text-ebony/75 hover:text-bayou";

  return (
    <nav
      className={
        transparent ? "absolute inset-x-0 top-0 z-30" : "bg-paper relative z-30"
      }
    >
      <div className="max-w-7xl mx-auto px-6 md:px-14 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="w-10 h-10" />
          <span
            className={`font-display text-lg font-semibold ${
              lightText ? "text-paper" : "text-bayou"
            }`}
          >
            My Ghana Rental
          </span>
        </Link>

        <div className="flex gap-8 items-center text-sm">
          <Link to="/about" className={linkClass}>
            About
          </Link>
          <Link to="/contact" className={linkClass}>
            Contact
          </Link>

          {isLoggedIn ? (
            <Link to="/dashboard" className={linkClass}>
              {user?.firstName}
            </Link>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-sun text-ebony font-medium px-6 py-2.5 rounded-full hover:brightness-95 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;