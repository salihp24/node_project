import { createContext, useContext, useState, useCallback } from "react"
import apiClient from "../api/apiClient"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
  const token = localStorage.getItem("token")
  if (!token) {
    setCartCount(0)
    return
  }

  try {
    const res = await apiClient.get('/cart')
    const count = (res.data.items || []).reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(count)
  } catch {
    setCartCount(0)
  }
}, [])

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}