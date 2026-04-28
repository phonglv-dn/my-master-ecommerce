"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "../../types"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const hydrateCart = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed)) {
            setItems(parsed)
          }
        } catch (e) {
          console.error("Failed to parse cart from local storage", e)
        }
      }
      setIsHydrated(true)
    }

    hydrateCart()
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : []
      const existing = safePrev.find((item) => item.product?.id === product.id)
      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + quantity,
          product.stock
        )
        return safePrev.map((item) =>
          item.product?.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      return [
        ...safePrev,
        { product, quantity: Math.min(quantity, product.stock) }
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) =>
      Array.isArray(prev)
        ? prev.filter((item) => item.product?.id !== productId)
        : []
    )
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      Array.isArray(prev)
        ? prev.map((item) =>
            item.product?.id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(quantity, item.product.stock))
                }
              : item
          )
        : []
    )
  }

  const clearCart = () => setItems([])

  const totalItems = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item?.quantity || 0), 0)
    : 0

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isHydrated
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
