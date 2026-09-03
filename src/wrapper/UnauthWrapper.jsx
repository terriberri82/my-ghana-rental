import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UnauthenticatedWrapper = ({ children, isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default UnauthenticatedWrapper;
