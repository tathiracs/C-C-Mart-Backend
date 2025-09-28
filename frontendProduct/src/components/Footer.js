import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>C&C Mart</h3>
          <p>Your trusted neighborhood grocery store since 2013.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Products</li>
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 123 Green Street, Fresh Valley</p>
          <p>📞 (555) 123-4567</p>
          <p>✉️ info@ccmart.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 C&C Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;