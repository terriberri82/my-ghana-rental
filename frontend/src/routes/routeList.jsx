import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import PropertyForm from "../pages/PropertyForm";
import Properties from "../pages/Properties";
import PropertyDetail from "../pages/PropertyDetail";
import UnitForm from "../pages/UnitForm";
import Units from "../pages/Units";
import UnitDetail from "../pages/UnitDetail";
import LeaseForm from "../pages/LeaseForm";
import PaymentForm from "../pages/PaymentForm";
import Payments from "../pages/Payments";
import Profile from "../pages/Profile";

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
  { path: "/properties", element: <Properties /> },
  { path: "/properties/new", element: <PropertyForm /> },
  { path: "/properties/:id/edit", element: <PropertyForm /> },
  { path: "/properties/:id", element: <PropertyDetail /> },
  { path: "/units", element: <Units /> },
  { path: "/units/new", element: <UnitForm /> },
  { path: "/units/:id/edit", element: <UnitForm /> },
  { path: "/units/:id", element: <UnitDetail /> },
  { path: "/leases/new", element: <LeaseForm /> },
  { path: "/payments/new", element: <PaymentForm /> },
  { path: "/payments/:id/edit", element: <PaymentForm /> },
  { path: "/payments", element: <Payments /> },
    { path: "/profile", element: <Profile /> },
];
