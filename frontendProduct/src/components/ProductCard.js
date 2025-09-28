import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log("Added to cart:", product.name);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Buy now logic here
    console.log("Buy now:", product.name);
    alert(`Proceeding to buy ${product.name}!`);
  };

  const handleImageError = (e) => {
    console.log("Image failed to load:", product.image);
    e.target.src = "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            onLoad={() => console.log("Image loaded successfully:", product.image)}
          />
        </div>
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-brand">{product.brand}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-desc">{product.description}</p>
        </div>
      </Link>
      <div className="product-actions">
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
