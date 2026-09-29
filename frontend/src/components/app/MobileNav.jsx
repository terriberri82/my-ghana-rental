import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Building2, DoorOpen, Wallet, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cloudinaryThumb } from "../../utils/cloudinaryUrl";
import logo from "../../assets/logo.png";

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/units", label: "Units", icon: DoorOpen },
  { to: "/payments", label: "Payments", icon: Wallet },
];

// Phone and small tablet navigation: a slim top bar plus a bottom tab bar.
// Hidden from md up, where the sidebar takes over.
export default function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden sticky top-0 z-30 bg-bayou h-14 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="w-7 h-7" />
          <span className="font-display text-sm font-semibold text-paper">
            My Ghana Rental
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/profile"
            aria-label="Your profile"
            className="w-10 h-10 grid place-items-center rounded-full"
          >
            {user?.avatarUrl ? (
              <img
                src={cloudinaryThumb(user.avatarUrl, 64, 64)}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sun"
              />
            ) : (
              <User size={20} className="text-paper" aria-hidden="true" />
            )}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="w-10 h-10 grid place-items-center rounded-full text-paper/70 hover:text-paper"
          >
            <LogOut size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-pearl pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-4">
          {tabs.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                    isActive ? "text-bayou" : "text-ebony/45"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-12 h-7 grid place-items-center rounded-full ${
                        isActive ? "bg-sun/30" : ""
                      }`}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}