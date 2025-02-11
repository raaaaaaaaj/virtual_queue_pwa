import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Hooks/useAuth";
import { useQueue } from "../Contexts/QueueContext"; // Import useQueue
import "../Styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated, checkAuth } = useAuth();
  const { refreshQueues } = useQueue(); // Get refreshQueues from QueueContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        },
      );
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      await checkAuth(); // Re-fetch user-specific data
      refreshQueues(); // Refresh queues after login
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
