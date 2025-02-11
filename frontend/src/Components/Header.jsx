import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import "../Styles/Header.css";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
    window.location.reload(); // Force a re-render
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Virtual Queue</h1>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
