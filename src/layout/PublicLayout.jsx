import { Outlet } from "react-router-dom";
import UnauthenticatedWrapper from "../wrapper/UnauthWrapper";

function PublicLayout() {
  return (
    <UnauthenticatedWrapper>
      <Outlet />
    </UnauthenticatedWrapper>
  );
}

export default PublicLayout;