import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import AuthLayout from "../layout/AuthLayout";
import UnauthLayout from "../layout/UnauthLayout";
import { publicRoutes, unauthRoutes, authRoutes } from "./routeList";

function AppRoutes({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Routes>
      <Route
        element={
          <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        }
      >
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          element={
            <UnauthLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        >
          {unauthRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route
        element={
          <AuthLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        }
      >
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
