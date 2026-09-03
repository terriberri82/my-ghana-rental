import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
];

export const unauthRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
];

export const authRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
];