import React from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import sampleProducts from "../data/sampleProducts";

function Products() {
  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>
      <div className="products-grid">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
