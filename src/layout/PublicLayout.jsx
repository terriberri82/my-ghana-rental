import { Outlet } from "react-router-dom";
import UnauthenticatedWrapper from "../wrapper/UnauthWrapper";

function PublicLayout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <UnauthenticatedWrapper
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    >
      <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
    </UnauthenticatedWrapper>
  );
}

export default PublicLayout;
