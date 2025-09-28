import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <div className="contact-detail">
          <h2>Address</h2>
          <p>123 Green Street<br />Fresh Valley, FV 12345</p>
        </div>
        <div className="contact-detail">
          <h2>Phone</h2>
          <p>(555) 123-4567</p>
        </div>
        <div className="contact-detail">
          <h2>Email</h2>
          <p>info@ccmart.com</p>
        </div>
        <div className="contact-detail">
          <h2>Hours</h2>
          <p>Mon-Sat: 8AM-8PM<br />Sunday: 9AM-6PM</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;