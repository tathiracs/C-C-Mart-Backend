import React from "react";
import { useParams } from "react-router-dom";
import sampleProducts from "../data/sampleProducts";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const product = sampleProducts.find((p) => p.id === Number(id));

  if (!product) return <div className="details-container">Product not found.</div>;

  return (
    <div className="details-container">
      <div className="details-image-wrap">
        <img src={product.image} alt={product.name} className="details-image" />
      </div>
      <div className="details-info">
        <h1>{product.name}</h1>
        <h3>{product.brand}</h3>
        <p className="details-price">${product.price}</p>
        <p>{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
