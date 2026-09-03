import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <aside className="w-56 bg-gray-900 text-white p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-4">My Ghana Rental</h2>

      <Link to="/dashboard" className="hover:text-emerald-300">Dashboard</Link>
      <Link to="/dashboard" className="hover:text-emerald-300">Properties</Link>
      <Link to="/dashboard" className="hover:text-emerald-300">Payments</Link>
      <Link to="/dashboard" className="hover:text-emerald-300">Maintenance</Link>

      <button
        onClick={handleLogout}
        className="mt-auto text-left text-red-300 hover:text-red-200"
      >
        Sign out
      </button>
    </aside>
  );
}

export default Sidebar;