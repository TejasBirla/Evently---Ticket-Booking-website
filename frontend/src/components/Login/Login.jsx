import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../../Contexts/AuthContext.jsx";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  const handleLogin = async (event) => {
    setIsLoggingIn(true);
    event.preventDefault();
    const loginData = { email, password };
    try {
      await loginUser(loginData);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Welcome Back 👋</h1>
      <p className="login-subtext">
        Log in to Evently and grab exciting ticket offers!
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmail}
          disabled={isLoggingIn}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePassword}
          disabled={isLoggingIn}
        />
        <button className="login-submit" type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging In..." : "Login"}
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
