import React, { useContext } from "react";
import { EventContext } from "../../Contexts/EventContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const { admin } = useContext(EventContext);
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1>Welcome to Evently Admin Panel</h1>
      <p>
        Manage all your events in one place. Please login to continue or go to
        your dashboard.
      </p>
      <p>
        Stay organized and in control with real-time updates, seamless
        integration, and a user-friendly dashboard.
      </p>
      <p>
        Whether you're hosting concerts, workshops, or conferences — Evently
        gives you the tools to make event management simple and efficient.
      </p>
      <div className="button-group">
        {admin ? (
          <button onClick={() => navigate("/admin")}>Go to Dashboard</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </div>
  );
}
