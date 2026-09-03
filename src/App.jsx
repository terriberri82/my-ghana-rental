import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}

export default App;
