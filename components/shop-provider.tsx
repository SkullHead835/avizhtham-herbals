"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Product, products as initialProducts } from "@/lib/products"

// Extend Product for admin tracking
export interface ShopProduct extends Product {
  quantityAvailable: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  district: string
  state: string
  pincode: string
  password?: string
  role?: "user" | "admin"
  isLoggedIn?: boolean
}

export interface CartItem {
  product: ShopProduct
  quantity: number
}

export interface Order {
  orderId: string
  userId: string | null   // null for guest orders
  date: string
  deliveryDetails: {
    fullName: string // maps to 'name' in form
    phone: string
    email: string
    addressLine1: string
    addressLine2: string
    district: string
    state: string
    pincode: string
  }
  paymentMethod: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled"
  paymentStatus: "Pending" | "Accepted" | "Rejected"
  paymentProofUploaded: boolean
}

interface ShopContextType {
  products: ShopProduct[]
  cartItems: CartItem[]
  users: User[]
  orders: Order[]
  currentUser: User | null
  isLoaded: boolean
  addToCart: (product: ShopProduct | Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartSubtotal: number
  loginUser: (email: string, password?: string) => boolean
  registerUser: (userData: Omit<User, "id">) => boolean
  logoutUser: () => void
  updateUser: (userId: string, updatedFields: Partial<User>) => boolean
  deleteUser: (userId: string) => void
  addProduct: (productData: Omit<ShopProduct, "quantityAvailable"> & { quantityAvailable?: number }) => boolean
  deleteProduct: (productId: string) => void
  updateProduct: (productId: string, updatedFields: Partial<ShopProduct>) => void
  placeOrder: (deliveryDetails: Order["deliveryDetails"], paymentMethod: string, proofUploaded: boolean) => Order
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  updatePaymentStatus: (orderId: string, status: Order["paymentStatus"]) => void
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>(initialProducts.map(p => ({ ...p, quantityAvailable: 50 })))
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Products catalog loading
      const storedProducts = localStorage.getItem("avizhtham_products")
      if (storedProducts) {
        try {
          const parsedProducts = JSON.parse(storedProducts)
          if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
            setProducts(parsedProducts)
          } else {
            throw new Error("Invalid stored product data")
          }
        } catch {
          const mappedProducts = initialProducts.map(p => ({ ...p, quantityAvailable: 50 }))
          setProducts(mappedProducts)
          localStorage.setItem("avizhtham_products", JSON.stringify(mappedProducts))
        }
      } else {
        const mappedProducts = initialProducts.map(p => ({ ...p, quantityAvailable: 50 }))
        setProducts(mappedProducts)
        localStorage.setItem("avizhtham_products", JSON.stringify(mappedProducts))
      }

      // Cart loading
      const storedCart = localStorage.getItem("avizhtham_cart")
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }

      // Users database loading
      const storedUsers = localStorage.getItem("avizhtham_users")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers) as User[]
        const normalizedUsers = parsedUsers.map((u) => ({ ...u, role: u.role ?? "user" }))
        setUsers(normalizedUsers)
        
        // Find if any user was logged in
        const loggedInUser = normalizedUsers.find(u => u.isLoggedIn)
        if (loggedInUser) {
          setCurrentUser(loggedInUser)
        }
      }

      // Orders ledger loading
      const storedOrders = localStorage.getItem("avizhtham_orders")
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      }
    } catch (e) {
      console.error("ShopProvider: error loading state", e)
    }
    setIsLoaded(true)
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("avizhtham_products", JSON.stringify(products))
  }, [products, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("avizhtham_cart", JSON.stringify(cartItems))
  }, [cartItems, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("avizhtham_users", JSON.stringify(users))
  }, [users, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("avizhtham_orders", JSON.stringify(orders))
  }, [orders, isLoaded])

  // Cart operations
  const addToCart = (product: ShopProduct | Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const shopProd = products.find(p => p.id === product.id) || { ...product, quantityAvailable: 50 }
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id)
      if (existingItemIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += quantity
        return newItems
      }
      return [...prevItems, { product: shopProd as ShopProduct, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  // Auth operations
  const loginUser = (email: string, password?: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase()
    const isAdminLogin = normalizedEmail === "admin@gmail.com" && password === "admin@123"

    if (isAdminLogin) {
      const existingAdmin = users.find(u => u.email.toLowerCase() === normalizedEmail)
      const adminUser: User = existingAdmin
        ? { ...existingAdmin, role: "admin", password: "admin@123", isLoggedIn: true }
        : {
            id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
            name: "Admin",
            email: "admin@gmail.com",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            district: "",
            state: "",
            pincode: "",
            password: "admin@123",
            role: "admin",
            isLoggedIn: true,
          }

      setUsers((prev) => {
        if (existingAdmin) {
          return prev.map((u) => (u.id === existingAdmin.id ? { ...u, ...adminUser, role: "admin", isLoggedIn: true } : u))
        }
        return [...prev, adminUser]
      })
      setCurrentUser(adminUser)
      return true
    }

    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      if (password && existingUser.password !== password) {
        return false
      }

      const updatedUser = { ...existingUser, role: existingUser.role ?? "user", isLoggedIn: true }
      setUsers((prev) => prev.map((u) => (u.id === existingUser.id ? updatedUser : u)))
      setCurrentUser(updatedUser)
      return true
    }
    return false
  }

  const registerUser = (userData: Omit<User, "id">): boolean => {
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())
    if (emailExists) return false

    const newUser: User = {
      ...userData,
      id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
      role: "user",
      isLoggedIn: true
    }

    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return true
  }

  const logoutUser = () => {
    if (currentUser) {
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, isLoggedIn: false } : u
      )
      setUsers(updatedUsers)
    }
    setCurrentUser(null)
  }

  // Product operations (Admin)
  const addProduct = (productData: Omit<ShopProduct, "quantityAvailable"> & { quantityAvailable?: number }) => {
    if (products.some((p) => p.id === productData.id)) {
      return false
    }
    const newProduct: ShopProduct = {
      ...productData,
      quantityAvailable: productData.quantityAvailable ?? 50,
    }
    setProducts((prev) => [...prev, newProduct])
    return true
  }

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateProduct = (productId: string, updatedFields: Partial<ShopProduct>) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p)
    )
  }

  const updateUser = (userId: string, updatedFields: Partial<User>) => {
    const emailCandidate = updatedFields.email?.toLowerCase()
    if (emailCandidate) {
      const duplicateEmail = users.some(
        (u) => u.id !== userId && u.email.toLowerCase() === emailCandidate
      )
      if (duplicateEmail) {
        return false
      }
    }

    let updated = false
    setUsers((prev) => prev.map((u) => {
      if (u.id === userId) {
        updated = true
        return { ...u, ...updatedFields }
      }
      return u
    }))

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => prev ? { ...prev, ...updatedFields } : prev)
    }

    return updated
  }

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    if (currentUser?.id === userId) {
      setCurrentUser(null)
      clearCart()
    }
  }

  // Order Placement
  const placeOrder = (
    deliveryDetails: Order["deliveryDetails"], 
    paymentMethod: string,
    proofUploaded: boolean
  ): Order => {
    const orderId = `AVZ-${Math.floor(100000 + Math.random() * 900000)}`
    const orderDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })

    const shippingCost = cartSubtotal >= 500 ? 0 : 49
    const taxCost = Math.round(cartSubtotal * 0.18)
    const totalCost = cartSubtotal + shippingCost + taxCost

    const newOrder: Order = {
      orderId,
      userId: currentUser?.id ?? null,
      date: orderDate,
      deliveryDetails,
      paymentMethod,
      items: cartItems.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal: cartSubtotal,
      shipping: shippingCost,
      tax: taxCost,
      total: totalCost,
      status: "Pending",
      paymentStatus: "Pending",
      paymentProofUploaded: proofUploaded
    }

    // Deduct stock if needed
    setProducts(prev => 
      prev.map(p => {
        const cartItem = cartItems.find(item => item.product.id === p.id)
        if (cartItem) {
          return {
            ...p,
            quantityAvailable: Math.max(0, p.quantityAvailable - cartItem.quantity)
          }
        }
        return p
      })
    )

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  // Admin order status update
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => 
      prev.map(o => o.orderId === orderId ? { ...o, status } : o)
    )
  }

  const updatePaymentStatus = (orderId: string, status: Order["paymentStatus"]) => {
    setOrders(prev => 
      prev.map(o => o.orderId === orderId ? { ...o, paymentStatus: status } : o)
    )
  }

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        users,
        orders,
        currentUser,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        loginUser,
        registerUser,
        logoutUser,
        updateUser,
        deleteUser,
        addProduct,
        deleteProduct,
        updateProduct,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
