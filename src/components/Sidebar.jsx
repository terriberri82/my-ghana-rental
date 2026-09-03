import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-56 bg-gray-900 text-white p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-4">My Ghana Rental</h2>

      <Link to="/dashboard" className="hover:text-blue-300">
        Dashboard
      </Link>
      <Link to="/dashboard" className="hover:text-blue-300">
        Properties
      </Link>
      <Link to="/dashboard" className="hover:text-blue-300">
        Payments
      </Link>
      <Link to="/dashboard" className="hover:text-blue-300">
        Maintenance
      </Link>
    </aside>
  );
}

export default Sidebar;
