import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ isAuth, setAuth }) => {  
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🟢 Navigation.jsx - Rendered");
  }, []);
  
  useEffect(() => {
    console.log("🟢 Navigation.jsx - Received isAuth:", typeof isAuth, isAuth);
  }, [isAuth]);
  
  useEffect(() => {
    console.log("🛠 Checking localStorage on render:", localStorage.getItem("token"));
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);  
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/my-cart">My Cart</Link></li>
        <li><Link to="/my-events">My Events</Link></li>
        <li><Link to="/find-events">Find Events</Link></li>
        {!isAuth ? ( 
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
