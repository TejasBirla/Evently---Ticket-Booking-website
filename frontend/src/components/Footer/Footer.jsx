import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { subscribeToNewsLetter } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   subscribeToNewsLetter(email);
  //   setEmail("");
  // };

  const handleSubmit = async (event) => {
    setIsSubscribing(true); // start loading state
    event.preventDefault();
    try {
      await subscribeToNewsLetter(email); // wait for promise to resolve
      setEmail(""); // clear input after success
    } finally {
      setIsSubscribing(false); // stop loading state
    }
  };

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
        <div className="footer-newsletter">
          <h3>NewsLetter</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* <button type="submit">Subscribe Now</button> */}
            <button type="submit" disabled={isSubscribing}>
              {isSubscribing ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
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
