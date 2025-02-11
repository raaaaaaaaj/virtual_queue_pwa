import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:8080/api/auth/check",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsAuthenticated(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
          });
          console.log("id", response.data.user.id);
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, user, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
