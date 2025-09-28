import React from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import sampleProducts from "../data/sampleProducts";

function Products() {
  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>
      {sampleProducts.length > 0 ? (
        <div className="products-grid">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div className="no-products-content">
            <h2>Coming Soon!</h2>
            <p>We're currently updating our product catalog.</p>
            <p>Please check back soon for amazing deals and fresh products!</p>
            <div className="grocery-icon">🛒</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
