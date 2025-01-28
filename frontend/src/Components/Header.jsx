import "../Styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Amusement Park Virtual Queue Portal</h1>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin" className="nav-link">
                Admin Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="/customer" className="nav-link">
                Customer View
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
