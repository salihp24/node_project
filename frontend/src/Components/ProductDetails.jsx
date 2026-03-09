import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./ProductsDetails.css"

function ProductDetails() {
  const { id } = useParams()
  const navigate=useNavigate()

  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  const addToCart = async (product) => {
  const userId = localStorage.getItem("userId")
  if (!userId) return alert("User not logged in")

  const res = await axios.get(
    `http://localhost:3001/cart?userId=${userId}&productId=${product.id}`
  )

  if (res.data.length > 0) {
    const item = res.data[0]

    await axios.patch(
      `http://localhost:3001/cart/${item.id}`,
      { quantity: item.quantity + 1 }
    )
  } else {
    await axios.post(`http://localhost:3001/cart`, {
      userId,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  alert("Item added to cart")
}


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/products/${id}`
        )
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

          <h2></h2>
          
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
            <h1 className="details-brand">{products.brand || products.title.split(' ')[0]}</h1>
            <p className="details-title">{products.title}</p>

            <div className="details-price-section">
              <p className="details-price">{products.price}</p>
              {products.originalPrice && (
                <p className="details-original-price">₹{products.originalPrice}</p>
              )}
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
                <li>Free shipping </li>
                <li>Easy returns within 30 days</li>
              </ul>
            </div>

            <div className="details-actions">
              <button className="details-btn-add-to-cart" onClick={() => addToCart(products)}>Add to Cart</button>
              <button className="details-btn-buy-now" onClick={()=>navigate(`/buy-now/${products.id}`)}>Buy Now</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails