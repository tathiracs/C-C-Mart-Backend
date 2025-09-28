import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-brand">{product.brand}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-desc">{product.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
