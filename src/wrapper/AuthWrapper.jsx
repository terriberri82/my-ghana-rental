import Sidebar from "../components/Sidebar";
import AppNavbar from "../components/AppNavbar";

const AuthenticatedWrapper = ({ children, setIsLoggedIn }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <AppNavbar setIsLoggedIn={setIsLoggedIn} />
        <main className="flex-grow p-8">{children}</main>
      </div>
    </div>
  );
};

export default AuthenticatedWrapper;
