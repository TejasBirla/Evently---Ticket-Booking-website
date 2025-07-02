import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { EventContext } from "../../Contexts/EventContext.jsx";

export default function Signup() {
  const { registerAdmin } = useContext(EventContext);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminData = { email, fullName, password, adminCode };
    registerAdmin(adminData);
    navigate("/");
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Join Evently Today</h2>
      <p className="signup-subtext">Create your account as Admin</p>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin Code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />
        <button className="signup-submit">Sign Up</button>
      </form>

      <p className="login-link">
        Already an Admin?{" "}
        <Link to="/login" className="Link-tag">
          <span>Login</span>
        </Link>
      </p>
    </div>
  );
}
