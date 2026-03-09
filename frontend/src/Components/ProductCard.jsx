import React from 'react'
import "./ProductCard.css"
import { Link } from 'react-router-dom'

function ProductCard({product}) {
  return (
    <div className="product-card">
        <img 
            src={product.image}
            alt={product.title}
            className="product-image"
        />
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₹{product.price}</p>
        <Link to={`/products/${product.id}`} className="view-details-button">View Details</Link>
    </div>
  )
}

export default ProductCard