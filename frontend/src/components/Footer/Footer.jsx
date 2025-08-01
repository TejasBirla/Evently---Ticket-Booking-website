import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const token = localStorage.getItem("token");
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
          <h2>Evently</h2>
          <p>Your gateway to the best events around you.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            {token && (
              <li>
                <Link to="/mybookings">My Bookings</Link>
              </li>
            )}
            {!token && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: tejasbirla3@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Evently. All rights reserved.</p>
      </div>
    </footer>
  );
}
