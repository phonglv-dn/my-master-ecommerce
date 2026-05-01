"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "../../types"

export interface CartItem {
  product: Product
  quantity: number
  /** Selected size label, e.g. "L" — empty string "OS" when product has no sizes. */
  size: string
  /** Selected color hex, e.g. "#000000". */
  color: string
}

export const cartLineKey = (productId: string, size: string, color: string) =>
  `${productId}::${size}::${color}`

interface AddToCartOptions {
  size: string
  color: string
  quantity?: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  addToCart: (product: Product, opts: AddToCartOptions) => void
  removeFromCart: (productId: string, size: string, color: string) => void
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void
  clearCart: () => void
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const isCartItem = (raw: unknown): raw is CartItem => {
  if (!raw || typeof raw !== "object") return false
  const v = raw as Record<string, unknown>
  return (
    typeof v.quantity === "number" &&
    typeof v.size === "string" &&
    typeof v.color === "string" &&
    v.product !== null &&
    typeof v.product === "object"
  )
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isCartItem))
        }
      } catch (e) {
        console.error("Failed to parse cart from local storage", e)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addToCart = (product: Product, opts: AddToCartOptions) => {
    const { size, color, quantity = 1 } = opts
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product?.id === product.id &&
          item.size === size &&
          item.color === color
      )
      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + quantity,
          product.stock
        )
        return prev.map((item) =>
          item === existing ? { ...item, quantity: newQuantity } : item
        )
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(quantity, product.stock),
          size,
          color,
        },
      ]
    })
  }

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product?.id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    )
  }

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product?.id === productId &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.product.stock)),
            }
          : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + (item?.quantity || 0), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isHydrated,
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
