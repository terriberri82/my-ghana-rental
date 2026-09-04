import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-600">
        {user.firstName} {user.lastName}
      </p>
    </header>
  );
}

export default AppNavbar;
