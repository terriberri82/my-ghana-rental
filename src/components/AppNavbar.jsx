function AppNavbar({ setIsLoggedIn }) {
  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <button
        onClick={() => setIsLoggedIn(false)}
        className="text-sm text-red-600 hover:text-red-700"
      >
        Log out
      </button>
    </header>
  );
}

export default AppNavbar;
