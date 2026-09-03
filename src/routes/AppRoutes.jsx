import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import AuthLayout from "../layout/AuthLayout";
import UnauthLayout from "../layout/UnauthLayout";
import { publicRoutes, unauthRoutes, authRoutes } from "./routeList";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={<UnauthLayout />}>
          {unauthRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
