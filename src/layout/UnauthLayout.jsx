import { Navigate, Outlet } from "react-router-dom";

function UnauthLayout({ isLoggedIn, setIsLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={{ isLoggedIn, setIsLoggedIn }} />;
}

export default UnauthLayout;
