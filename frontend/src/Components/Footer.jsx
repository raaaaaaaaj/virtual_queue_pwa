import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">Contact Details</h3>
          <p className="footer-text">Email: support@amusementpark.com</p>
          <p className="footer-text">Phone: +1 (123) 456-7890</p>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Park Operating Hours</h3>
          <p className="footer-text">Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p className="footer-text">Saturday - Sunday: 8:00 AM - 10:00 PM</p>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li>
              <a href="/terms" className="footer-link">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/faq" className="footer-link">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Amusement Park. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
