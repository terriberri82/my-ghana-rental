import Sidebar from "../components/app/Sidebar";

const AuthenticatedWrapper = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 min-w-0 px-5 md:px-10 py-8">{children}</main>
    </div>
  );
};

export default AuthenticatedWrapper;
