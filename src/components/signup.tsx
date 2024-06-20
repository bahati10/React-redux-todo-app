// src/components/Signup.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./common/Navbar";
import { signupUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import "../style.css";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      signupUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  useEffect(() => {
    if (user) {
      // Redirect to login page after successful signup
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="signup">
      <Navbar />
      <div className="title">Get started</div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="firstname" className="firstname-label">
          First Name
        </label>
        <input
          type="text"
          name="firstname"
          className="firstname-input"
          value={formData.firstname}
          onChange={handleChange}
        />

        <label htmlFor="lastname" className="lastname-label">
          Last Name
        </label>
        <input
          type="text"
          name="lastname"
          className="lastname-input"
          value={formData.lastname}
          onChange={handleChange}
        />

        <label htmlFor="email" className="email-label">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="email-input"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password" className="password-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="password-input"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="have-account">
          Already have an account?{" "}
          <Link to="/login">
            <span className="link">login here</span>
          </Link>
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
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

export default Signup;
