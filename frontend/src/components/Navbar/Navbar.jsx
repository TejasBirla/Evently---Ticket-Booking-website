import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/evently-logo.png";
import "./navbar.css";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Navbar() {
  const { logoutUser, authUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="container">
      <div className="left-side-nav">
        <img src={logo} alt="Evently-Logo" className="logo" />
        <h1 className="logo-heading">Evently</h1>
      </div>
      <div className={`center-side-nav ${menuOpen ? "active" : " "}`}>
        <span className="menuBtn" onClick={toggleMenu}>
          &#9776;
        </span>
        <ul>
          <li onClick={() => handleNav("/")}>Home</li>
          <li onClick={() => handleNav("/events")}>Events</li>
          {authUser && (
            <li onClick={() => handleNav("/mybookings")}>My Bookings</li>
          )}
        </ul>
      </div>
      {authUser ? (
        <button className="login-btn" onClick={logoutUser}>
          Logout
        </button>
      ) : (
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  );
}
