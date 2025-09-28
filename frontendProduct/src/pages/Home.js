import React from "react";
import heroImg from "../assets/hero_grocery.jpg";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <img src={heroImg} alt="Grocery Shop" className="hero-img" />
        <div className="hero-text">
          <h1>Welcome to C&C Mart</h1>
          <p>Your one-stop shop for fresh groceries and daily essentials.</p>
        </div>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <h2>Fresh Produce</h2>
          <p>Get the freshest fruits and vegetables delivered to your doorstep.</p>
        </div>
        <div className="feature-card">
          <h2>Best Prices</h2>
          <p>Enjoy competitive prices on all your grocery needs.</p>
        </div>
        <div className="feature-card">
          <h2>Fast Delivery</h2>
          <p>Quick and reliable delivery for your convenience.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
