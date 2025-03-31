import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getRoutes } from "./routes/routes";
import Navigation from "./components/Navigation/Navigation";

function App() {
  const [isAuth, setAuth] = useState(() => !!localStorage.getItem("token"));
  const [forceRender, setForceRender] = useState(0); 

  useEffect(() => {
    console.log("🔥 App.jsx - Before passing to Navigation:", typeof isAuth, isAuth);
  }, [isAuth]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);  // Ensure state updates correctly
  }, [window.location.pathname]);  
  

  return (
    <Router>
      <Navigation key={isAuth ? "auth-true" : "auth-false"} isAuth={isAuth} setAuth={setAuth} />
      <Routes>
        {getRoutes(setAuth).map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
