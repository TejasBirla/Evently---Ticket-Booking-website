import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Signup() {
  const { signupUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const signupData = { email, fullName, password };
    signupUser(signupData);
    navigate("/");
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Join Evently Today</h2>
      <p className="signup-subtext">
        Create your account to explore amazing events
      </p>

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
        <button className="signup-submit">Sign Up</button>
      </form>

      <p className="login-link">
        Already have an account?{" "}
        <Link to="/login" className="Link-tag">
          <span>Login</span>
        </Link>
      </p>
    </div>
  );
}
