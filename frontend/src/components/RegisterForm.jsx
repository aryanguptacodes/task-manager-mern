import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // If already logged in, don't show register page
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/register", form);

      toast.success(data.message);

      // After registration, go to login page
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Enter name"
            onChange={handleChange}
            autoComplete="name"
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            placeholder="Enter username"
            onChange={handleChange}
            autoComplete="username"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Enter email"
            onChange={handleChange}
            autoComplete="email"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Enter password"
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button type="submit">Register</button>

          <div className="footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
