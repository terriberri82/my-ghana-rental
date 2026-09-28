import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
      <div className="max-w-7xl mx-auto px-4 md:px-14 h-20 md:h-24 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 md:gap-2.5 shrink-0">
          <img src={logo} alt="" className="w-7 h-7 md:w-10 md:h-10" />
          <span
            className={`font-display text-sm md:text-lg font-semibold whitespace-nowrap ${
              lightText ? "text-paper" : "text-bayou"
            }`}
          >
            My Ghana Rental
          </span>
        </Link>

        <div className="flex items-center gap-2.5 md:gap-8 text-xs md:text-sm">
          <Link to="/about" className={`hidden md:block ${linkClass}`}>
            About
          </Link>
          <Link to="/contact" className={`hidden md:block ${linkClass}`}>
            Contact
          </Link>

          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="bg-sun text-ebony font-medium px-3 md:px-6 py-2 md:py-2.5 rounded-full whitespace-nowrap hover:brightness-95 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={`whitespace-nowrap ${linkClass}`}>
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-sun text-ebony font-medium px-3 md:px-6 py-2 md:py-2.5 rounded-full whitespace-nowrap hover:brightness-95 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`md:hidden shrink-0 ${
              lightText ? "text-paper" : "text-bayou"
            }`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-paper border-t border-pearl shadow-sm">
          <div className="px-4 py-2">
            <Link
              to="/about"
              className="block py-3 text-sm text-ebony/75 border-b border-pearl/60 hover:text-bayou"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-sm text-ebony/75 hover:text-bayou"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;