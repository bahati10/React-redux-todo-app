// src/components/Login.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./common/Navbar";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import "../style.css";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.user
  );

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email: credentials.email,
        password: credentials.password,
      })
    );
  };

  useEffect(() => {
    if (user) {
      // Redirect to homepage or dashboard after successful login
      navigate("/todo");
    }
  }, [user, navigate]);

  return (
    <div className="login">
      <Navbar />
      <div className="title">Login Here</div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="email-label">
          Email
        </label>
        <input
          type="text"
          name="email"
          className="email-input"
          value={credentials.email}
          onChange={handleChange}
        />

        <label htmlFor="password" className="password-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="password-input"
          value={credentials.password}
          onChange={handleChange}
        />

        <div className="no-account">
          No account?{" "}
          <Link to="/signup">
            <span className="link">signup here</span>
          </Link>
        </div>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div className="error">
            {typeof error === "string" ? (
              error
            ) : (
              <pre>{JSON.stringify(error, null, 2)}</pre>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
