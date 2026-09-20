import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/properties", label: "Properties", icon: "building" },
  { to: "/units", label: "Units", icon: "door" },
  { to: "/payments", label: "Payments", icon: "cash" },
];

function Icon({ name }) {
  const paths = {
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    building:
      "M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
    door: "M14 3v18M4 21h16M6 21V5a2 2 0 012-2h8M11 12h.01",
    cash: "M2 7h20v10H2zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5M6 10v.01M18 14v.01",
    person:
      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <aside className="bg-bayou w-16 md:w-56 shrink-0 flex flex-col">
      <Link
        to="/"
        className="h-20 flex items-center gap-3 px-3 md:px-5 hover:opacity-80 transition-opacity"
      >
        <img src={logo} alt="" className="w-9 h-9 shrink-0" />
        <span className="hidden md:block font-display text-sm font-semibold text-paper leading-tight">
          My Ghana Rental
        </span>
      </Link>

      <nav className="flex-1 px-2 md:px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                isActive
                  ? "bg-bayou-deep text-paper"
                  : "text-paper/60 hover:text-paper hover:bg-bayou-deep/50"
              }`
            }
          >
            <Icon name={link.icon} />
            <span className="hidden md:block">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 md:p-3 border-t border-paper/10 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
              isActive
                ? "bg-bayou-deep text-paper"
                : "text-paper/70 hover:text-paper hover:bg-bayou-deep/50"
            }`
          }
        >
          <Icon name="person" />
          <span className="hidden md:block truncate">
            {user?.firstName} {user?.lastName}
          </span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-paper/60 hover:text-paper rounded-sm hover:bg-bayou-deep/50"
        >
          <span className="hidden md:inline">Log out</span>
          <span className="md:hidden">→</span>
        </button>
      </div>
    </aside>
  );
}
