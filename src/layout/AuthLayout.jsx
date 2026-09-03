import { Navigate, Outlet } from "react-router-dom";
import AuthenticatedWrapper from "../wrapper/AuthWrapper";

function AuthLayout({ isLoggedIn }) {
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
