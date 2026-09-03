import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UnauthLayout() {
  const { isLoggedIn, checkingSession } = useAuth();

  if (checkingSession) {
    return <p className="p-8">Loading...</p>;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default UnauthLayout;
