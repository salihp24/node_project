import React from 'react'
import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import "./AdminProducts.css"

function AdminProducts() {

    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [products, setProducts] = useState([])
    const [isNewBrand, setIsNewBrand] = useState(false)
    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        image: "",
        category: ""
    })

    const fetchProducts = async () => {
    try {
        const res = await apiClient.get("/admin/products")
        setProducts(res.data)
    } catch (error) {
        console.log(error)
    }
}

    useEffect(() => {
        fetchProducts()
    }, [])

    // Derive unique brands dynamically from products
    const uniqueBrands = [...new Set(products.map(p => p.category).filter(Boolean))].sort()

    const handleEdit = (product) => {
        setIsEditing(true)
        setEditId(product._id)
        setIsNewBrand(false)
        setForm({
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category || ""
        })
    }

    const handleDelete = async (id) => {
        await apiClient.delete(`/admin/products/${id}`)
        fetchProducts()
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("title", form.title)
        formData.append("price", form.price)
        formData.append("description", form.description)
        formData.append("category", form.category)
        if (form.image) formData.append("image", form.image)

        try {
            if (isEditing) {
                await apiClient.put(`/admin/products/${editId}`, formData)
                alert("Product updated successfully")
            } else {
                await apiClient.post("/admin/products", formData)
                alert("Product added successfully")
            }
            setForm({ title: "", price: "", description: "", image: null, category: ""})
            setIsEditing(false)
            setEditId(null)
            setIsNewBrand(false)
            fetchProducts()
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong")
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditId(null)
        setIsNewBrand(false)
        setForm({ title: "", price: "", description: "", image: "", category: "" })
    }

    const handleBrandChange = (e) => {
        const value = e.target.value
        if (value === "__new__") {
            setIsNewBrand(true)
            setForm({ ...form, category: "" })
        } else {
            setIsNewBrand(false)
            setForm({ ...form, category: value })
        }
    }

    return (
        <div className="admin-products-page">
            <div className="admin-products-header">
                <h2 className="admin-products-title">Product Management</h2>
            </div>

            <div className="admin-products-container">

                {/* ── Form Section ── */}
                <div className="admin-form-section">
                    <h3 className="admin-form-title">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h3>

                    <div className="admin-form-group">
                        <input
                            placeholder="Product Title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="admin-input"
                        />
                    </div>

                    <div className="admin-form-group">
                        <input
                            placeholder="Price (e.g., 1,14,999)"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            className="admin-input"
                        />
                    </div>

                    <div className="admin-form-group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setForm({ ...form, image: e.target.files[0] })}
                        />
                    </div>

                    {/* ✅ Dynamic Brand Dropdown */}
                    <div className="admin-form-group">
                        <select
                            value={isNewBrand ? "__new__" : form.category}
                            onChange={handleBrandChange}
                            className="admin-input admin-select"
                        >
                            <option value="">Select Brand</option>
                            {uniqueBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                            <option value="__new__">➕ Add New Brand</option>
                        </select>
                    </div>

                    {/* ✅ Show text input only when "Add New Brand" is selected */}
                    {isNewBrand && (
                        <div className="admin-form-group">
                            <input
                                placeholder="Type new brand name (e.g. Rado, Omega...)"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="admin-input"
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="admin-form-group">
                        <textarea
                            placeholder="Product Description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="admin-textarea"
                        />
                    </div>

                    <button onClick={handleSubmit} className="admin-submit-button">
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>

                    {isEditing && (
                        <button
                            onClick={handleCancel}
                            className="admin-submit-button"
                            style={{ marginTop: '10px', background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* ── Product List ── */}
                <div className="admin-products-list">
                    <h3 className="admin-list-title">
                        Existing Products ({products.length})
                    </h3>

                    {products.length === 0 ? (
                        <div className="admin-no-products">
                            No products available. Add your first product!
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="admin-product-item">
                                <div className="admin-product-header">
                                    <div className="admin-product-info">
                                        <h4 className="admin-product-title">{product.title}</h4>
                                        <p className="admin-product-price">₹{product.price}</p>
                                        <p className="admin-product-description">{product.description}</p>
                                        {product.category && (
                                            <span className="admin-category-badge">
                                                🏷️ {product.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="admin-product-actions">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="admin-edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="admin-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default AdminProducts