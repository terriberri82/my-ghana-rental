import Sidebar from "../components/app/Sidebar";
import MobileNav from "../components/app/MobileNav";

const AuthenticatedWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper md:flex">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 min-w-0 px-4 sm:px-5 md:px-10 pt-5 md:pt-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedWrapper;
