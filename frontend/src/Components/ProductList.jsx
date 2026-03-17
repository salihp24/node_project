import React from 'react'
import { useEffect, useState } from 'react'
import apiClient from "../api/apiClient.js"
import ProductCard from './ProductCard'
import "./ProductCard.css"

function ProductList() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState(["All"])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchOpen, setSearchOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const LIMIT = 8

    // ── Debounce search — waits 500ms after user stops typing ─────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // ── Fetch categories once on mount ────────────────────────────────────────
    useEffect(() => {
        apiClient.get('/products', { params: { limit: 1000 } })
            .then(res => {
                const cats = res.data.products.map(p => p.category).filter(Boolean)
                setCategories(["All", ...new Set(cats)])
            })
            .catch(err => console.log("Error fetching categories", err))
    }, [])

    // ── Fetch products on page / filter / debounced search change ─────────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const params = { page: currentPage, limit: LIMIT }
                if (activeCategory !== "All") params.category = activeCategory
                if (debouncedSearch) params.keyword = debouncedSearch

                const res = await apiClient.get('/products', { params })
                setProducts(res.data.products)
                setTotalPages(res.data.totalPages)
            } catch (error) {
                console.log("Error fetching products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [currentPage, activeCategory, debouncedSearch])

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCategoryChange = (cat) => {
        setActiveCategory(cat)
        setCurrentPage(1)
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        // no setCurrentPage here — debounce useEffect handles it
    }

    const handleSearchClear = () => {
        setSearchQuery("")
        setDebouncedSearch("")
        setSearchOpen(false)
        setCurrentPage(1)
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Search Bar */}
            <div className="search-bar">
                <div className={`search-wrapper ${searchOpen ? "open" : ""}`}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            className="search-clear-btn"
                            onClick={handleSearchClear}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    className="search-icon-btn"
                    onClick={() => {
                        setSearchOpen(!searchOpen)
                        if (searchOpen) handleSearchClear()
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
                        onClick={() => handleCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {loading ? (
                <h3>Loading Products...</h3>
            ) : (
                <div className="product-grid">
                    {products.length === 0 ? (
                        <p>No Products Found</p>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`page-btn ${currentPage === page ? "active" : ""}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    )
}

export default ProductList