import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1>About C&C Mart</h1>
      <p>
        C&C Mart is your trusted neighborhood grocery store, committed to providing
        fresh, quality products at affordable prices. We have been serving our
        community for over 10 years, building lasting relationships with our customers.
      </p>
      <div className="about-features">
        <div className="about-feature">
          <h2>Quality Assurance</h2>
          <p>We source our products from trusted suppliers to ensure freshness and quality.</p>
        </div>
        <div className="about-feature">
          <h2>Community Focus</h2>
          <p>Supporting local farmers and suppliers is at the heart of our business.</p>
        </div>
        <div className="about-feature">
          <h2>Customer Service</h2>
          <p>Our friendly staff is always ready to help you find what you need.</p>
        </div>
      </div>
    </div>
  );
}

export default About;