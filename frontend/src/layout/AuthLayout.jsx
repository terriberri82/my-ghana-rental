import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthenticatedWrapper from "../wrapper/AuthWrapper";

function AuthLayout() {
  const { isLoggedIn, checkingSession } = useAuth();

  if (checkingSession) {
    return <p className="p-8">Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthenticatedWrapper>
      <Outlet />
    </AuthenticatedWrapper>
  );
}

export default AuthLayout;
