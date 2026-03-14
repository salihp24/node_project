import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../Context/cartContext'
import apiClient from '../api/apiClient'
import "./ProductsDetails.css"

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshCartCount } = useCart()

  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  const addToCart = async (product) => {
    try {
      await apiClient.post('/cart', { productId: product._id, quantity: 1 })
      refreshCartCount()
      alert("Item added to cart")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart")
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get(`/products/${id}`)
        setProducts(res.data)
      } catch (error) {
        console.log("Failed to fetch product", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [id])

  if (loading) return <p>Loading Products...</p>
  if (!products) return <p>Products Not Found</p>

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-content">

          <div className="details-image-section">
            <div className="details-main-image-container">
              <img
                src={products.image}
                alt={products.title}
                className="details-main-image"
              />
            </div>
          </div>

          <div className="details-info-section">
            <h1 className="details-brand">{products.brand || products.title?.split(' ')[0]}</h1>
            <p className="details-title">{products.title}</p>

            <div className="details-price-section">
              <p className="details-price">{products.price ? Number(products.price).toLocaleString('en-IN') : ''}</p>
            </div>

            <div className="details-description-section">
              <h3 className="details-section-title">Product Description</h3>
              <p className="details-description">{products.description}</p>
            </div>

            <div className="details-description-section">
              <h3 className="details-section-title">Key Features</h3>
              <ul className="details-features">
                <li>Premium quality materials</li>
                <li>Original brand product</li>
                <li>1 Year warranty included</li>
                <li>Free shipping</li>
                <li>Easy returns within 30 days</li>
              </ul>
            </div>

            <div className="details-actions">
              <button className="details-btn-add-to-cart" onClick={() => addToCart(products)}>Add to Cart</button>
              <button className="details-btn-buy-now" onClick={() => navigate(`/buy-now/${products._id}`)}>Buy Now</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails