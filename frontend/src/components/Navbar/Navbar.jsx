import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/evently-logo.png";
import "./navbar.css";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Navbar() {
  const { logoutUser, authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="left-side-nav">
        <img src={logo} alt="Evently-Logo" className="logo" />
        <h1 className="logo-heading">Evently</h1>
      </div>
      <div className="center-side-nav">
        <ul>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/events")}>Events</li>
          {authUser && (
            <li onClick={() => navigate("/mybookings")}>My Bookings</li>
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
