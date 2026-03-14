import React from 'react'
import { useEffect, useState, useMemo } from 'react'
import apiClient from "../api/apiClient.js"
import ProductCard from './ProductCard'
import "./ProductCard.css"

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchOpen, setSearchOpen] = useState(false) 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get('/products')
                setProducts(res.data)
            } catch (error) {
                console.log("Error fetching products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const shuffleArray = (arr) => {
        const shuffled = [...arr]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    const categories = useMemo(() => {
        const cats = products.map((p) => p.category).filter(Boolean)
        return ["All", ...new Set(cats)]
    }, [products])

    const filteredProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesCategory =
                activeCategory === "All" || product.category === activeCategory
            const matchesSearch =
                product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
        return activeCategory === "All" ? shuffleArray(filtered) : filtered
    }, [products, activeCategory, searchQuery])

    if (loading) {
        return <h3>Loading Products...</h3>
    }

    return (
        <>
            {/* ✅ Search Bar with expand toggle */}
            <div className="search-bar">
                <div className={`search-wrapper ${searchOpen ? "open" : ""}`}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            className="search-clear-btn"
                            onClick={() => { setSearchQuery(""); setSearchOpen(false) }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* 🔍 Search Icon Button */}
                <button
                    className="search-icon-btn"
                    onClick={() => {
                        setSearchOpen(!searchOpen)
                        if (searchOpen) setSearchQuery("")
                    }}
                >
                    {searchOpen ? "✕" : "🔍"}
                </button>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {filteredProducts.length === 0 ? (
                    <p>No Products Found</p>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                )}
            </div>
        </>
    )
}

export default ProductList