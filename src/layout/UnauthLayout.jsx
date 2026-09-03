import { Navigate, Outlet } from "react-router-dom";
import UnauthenticatedWrapper from "../wrapper/UnauthWrapper";

function UnauthLayout({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <UnauthenticatedWrapper>
      <Outlet />
    </UnauthenticatedWrapper>
  );
}

export default UnauthLayout;
