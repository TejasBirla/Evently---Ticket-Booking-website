import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { EventContext } from "../../Contexts/EventContext.jsx";

export default function Login() {
  const { loginAdmin } = useContext(EventContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  const handleLogin = (event) => {
    event.preventDefault();
    const adminData = { email, password };
    loginAdmin(adminData);
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Welcome Back 👋</h1>
      <p className="login-subtext">Log in to Evently as Admin</p>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmail}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePassword}
        />
        <button className="login-submit" type="submit">
          Login
        </button>
      </form>

      <p className="signup-link">
        New to Evently?{" "}
        <Link to="/signup" className="Link-tag">
          <span>Signup</span>
        </Link>
      </p>
    </div>
  );
}
