"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop, ShopProduct, Order } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  ShieldAlert, 
  BarChart3, 
  Package, 
  Users, 
  ShoppingBag, 
  Check, 
  X, 
  Clock, 
  Mail,
  Edit,
  Save,
  UserCheck,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Phone,
  MapPin,
  Truck,
  Plus,
  Trash2
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { 
    currentUser,
    products, 
    users, 
    orders, 
    updateProduct, 
    updateOrderStatus, 
    updatePaymentStatus,
    addProduct,
    deleteProduct,
    updateUser,
    deleteUser,
    logoutUser,
  } = useShop()

  // Authentication gate state
  const [isAdmin, setIsAdmin] = useState(false)

  // Active Admin tab: 'dashboard' | 'orders' | 'products' | 'customers'
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "customers">("dashboard")

  // Product Editing state
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ShopProduct>>({
    id: "",
    name: "",
    tag: "",
    image: "",
    description: "",
    details: "",
    price: 0,
    quantityAvailable: 0,
    rating: 0,
    reviewsCount: 0,
    gallery: []
  })
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?redirect=/admin")
      return
    }

    if (currentUser.role !== "admin") {
      router.push("/")
      return
    }

    setIsAdmin(true)
  }, [currentUser, router])

  const handleAdminLogout = () => {
    logoutUser()
    setIsAdmin(false)
    toast.success("Logged out from admin panel.")
    router.push("/")
  }

  // Product edit start handler
  const startEditing = (p: ShopProduct) => {
    setEditingProductId(p.id)
    setIsAddingProduct(false)
    setEditForm({
      ...p
    })
  }

  // Product edit save handler
  const saveProductEdits = (productId: string) => {
    const priceValue = Number(editForm.price ?? 0)
    const quantityValue = Number(editForm.quantityAvailable ?? -1)

    if (!editForm.image || !editForm.name || !editForm.description || !editForm.tag || priceValue <= 0 || quantityValue < 0) {
      toast.error("Please fill in valid values for all fields.")
      return
    }

    updateProduct(productId, {
      name: editForm.name,
      tag: editForm.tag,
      image: editForm.image,
      description: editForm.description,
      details: editForm.details || "",
      price: priceValue,
      quantityAvailable: quantityValue,
      gallery: editForm.gallery || [editForm.image],
      rating: editForm.rating ?? 4.8,
      reviewsCount: editForm.reviewsCount ?? 0,
    })

    setEditingProductId(null)
    setIsAddingProduct(false)
    toast.success("Product updated successfully!")
  }

  const openAddProduct = () => {
    setIsAddingProduct(true)
    setEditingProductId(null)
    setEditForm({
      id: "",
      name: "",
      tag: "Wellness",
      image: "",
      description: "",
      details: "",
      price: 0,
      quantityAvailable: 50,
      rating: 4.8,
      reviewsCount: 0,
      gallery: []
    })
  }

  const handleImageUpload = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEditForm(prev => ({ ...prev, image: reader.result as string, gallery: [reader.result as string] }))
    }
    reader.readAsDataURL(file)
  }

  const createSlugFromText = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const addNewProduct = () => {
    const priceValue = Number(editForm.price ?? 0)
    const quantityValue = Number(editForm.quantityAvailable ?? -1)
    const idValue = createSlugFromText(editForm.id || editForm.name || "")

    if (!idValue || !editForm.name || !editForm.description || !editForm.tag || !editForm.image || priceValue <= 0 || quantityValue < 0) {
      toast.error("Please fill in valid values for all fields.")
      return
    }

    const success = addProduct({
      id: idValue,
      name: editForm.name,
      tag: editForm.tag,
      image: editForm.image,
      description: editForm.description,
      details: editForm.details || "",
      price: priceValue,
      quantityAvailable: quantityValue,
      rating: editForm.rating ?? 4.8,
      reviewsCount: editForm.reviewsCount ?? 0,
      gallery: editForm.gallery?.length ? editForm.gallery : [editForm.image]
    })

    if (!success) {
      toast.error("A product with this ID already exists. Choose a unique ID.")
      return
    }

    setIsAddingProduct(false)
    setEditForm({
      id: "",
      name: "",
      tag: "Wellness",
      image: "",
      description: "",
      details: "",
      price: 0,
      quantityAvailable: 50,
      rating: 4.8,
      reviewsCount: 0,
      gallery: []
    })
    toast.success("Product added successfully!")
  }

  const handleDeleteProduct = (productId: string) => {
    if (!window.confirm("Delete this product from the catalog? This cannot be undone.")) {
      return
    }
    deleteProduct(productId)
    if (editingProductId === productId) {
      setEditingProductId(null)
      setIsAddingProduct(false)
    }
    toast.success("Product deleted from catalog.")
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!window.confirm(`Delete user ${userName}? This will remove their account permanently.`)) {
      return
    }
    deleteUser(userId)
    toast.success(`User ${userName} removed successfully.`)
  }

  const statusOptions: Order["status"][] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ]

  const getStatusBadgeClass = (status: Order["status"]) => {
    if (status === "Delivered") return "bg-emerald-600 text-white"
    if (status === "Cancelled") return "bg-destructive text-white"
    if (status === "Confirmed" || status === "Processing" || status === "Shipped" || status === "Out for Delivery") return "bg-primary text-primary-foreground"
    return "bg-amber-500 text-white"
  }

  const getStatusTextClass = (status: Order["status"]) => {
    if (status === "Delivered") return "text-emerald-600"
    if (status === "Cancelled") return "text-destructive"
    if (status === "Confirmed" || status === "Processing" || status === "Shipped" || status === "Out for Delivery") return "text-primary"
    return "text-amber-600"
  }

  // Summary Metrics calculations
  const totalOrdersPlaced = orders.length
  const totalOrdersDelivered = orders.filter(o => o.status === "Delivered").length

  // Total amount received is sum of order total for orders where paymentStatus is 'Accepted'
  const totalAmountReceived = orders
    .filter(o => o.paymentStatus === "Accepted")
    .reduce((sum, o) => sum + o.total, 0)

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="max-w-md w-full mx-auto px-6 pt-32 pb-24 flex-grow flex flex-col justify-center">
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-xl shadow-primary/5 animate-fade-up">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-foreground font-normal">Admin Portal</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Sign in with the shared admin credentials to manage products and orders.
              </p>
            </div>
            <Button onClick={() => router.push("/login?redirect=/admin")} className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-sm mt-6">
              Go to Login
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full flex-grow">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light">
              Clinical Control Center
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Clinic administrator: <span className="font-semibold text-primary">admin@gmail.com</span>
            </p>
          </div>
          <Button 
            onClick={handleAdminLogout} 
            variant="outline" 
            className="rounded-full border-border hover:bg-destructive/5 hover:text-destructive self-start md:self-auto"
          >
            Logout Panel
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex overflow-x-auto pb-1 mb-8 border-b border-border/30 gap-2 scrollbar-hide">
          {[
            { id: "dashboard", label: "Overview Dashboard", icon: BarChart3 },
            { id: "orders", label: "Order Management", icon: ShoppingBag },
            { id: "products", label: "Products Catalog", icon: Package },
            { id: "customers", label: "Customer Logs", icon: Users }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Orders Placed */}
              <div className="bg-card rounded-3xl border border-border/50 p-6 flex items-center justify-between shadow-lg shadow-primary/5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Orders Placed
                  </span>
                  <span className="text-3xl font-bold text-foreground">{totalOrdersPlaced}</span>
                  <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>Total received ledgers</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl text-secondary">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Orders Delivered */}
              <div className="bg-card rounded-3xl border border-border/50 p-6 flex items-center justify-between shadow-lg shadow-primary/5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Orders Accepted / Delivered
                  </span>
                  <span className="text-3xl font-bold text-primary">{totalOrdersDelivered}</span>
                  <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Accepted dispatch status</span>
                  </div>
                </div>
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Amount Received */}
              <div className="bg-card rounded-3xl border border-border/50 p-6 flex items-center justify-between shadow-lg shadow-primary/5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Amount Received
                  </span>
                  <span className="text-3xl font-bold text-foreground">₹{totalAmountReceived}</span>
                  <div className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Cleared payments total</span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Summary list of recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders block */}
              <div className="lg:col-span-8 bg-card rounded-3xl border border-border/50 p-6 shadow-lg shadow-primary/5">
                <h3 className="font-serif text-lg text-foreground font-semibold mb-4 pb-2 border-b border-border/30">
                  Recent Orders Checklist
                </h3>
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.orderId} className="flex justify-between items-center text-xs p-3.5 rounded-xl border border-border/40 hover:bg-muted/10 transition-colors">
                        <div>
                          <p className="font-mono font-bold text-primary">{o.orderId}</p>
                          <p className="text-muted-foreground mt-0.5">{o.deliveryDetails.fullName} • ₹{o.total}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full font-bold text-[9px] ${
                            o.status === "Accepted" ? "bg-primary/10 text-primary" : o.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-50 text-amber-600"
                          }`}>
                            Order: {o.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full font-bold text-[9px] ${
                            o.paymentStatus === "Accepted" ? "bg-emerald-50 text-emerald-600" : o.paymentStatus === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-50 text-amber-600"
                          }`}>
                            Pay: {o.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <button onClick={() => setActiveTab("orders")} className="text-xs font-semibold text-primary hover:underline block mx-auto pt-2">
                        View all {orders.length} orders &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick statistics block */}
              <div className="lg:col-span-4 bg-card rounded-3xl border border-border/50 p-6 shadow-lg shadow-primary/5">
                <h3 className="font-serif text-lg text-foreground font-semibold mb-4 pb-2 border-b border-border/30">
                  Clinic Logs
                </h3>
                <div className="space-y-4 text-xs font-medium">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Registered Customers</span>
                    <span className="text-foreground font-bold">{users.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Active Sessions</span>
                    <span className="text-primary font-bold">{users.filter(u => u.isLoggedIn).length} online</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Catalog Products</span>
                    <span className="text-foreground font-bold">{products.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground border-t border-border/30 pt-3 text-[10px] text-muted-foreground leading-normal">
                    <span>Credentials: admin@gmail.com / admin123. Session stores locally in memory.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 2: ORDER MANAGEMENT ==================== */}
        {activeTab === "orders" && (
          <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 animate-fade-up">
            <h2 className="font-serif text-xl text-foreground font-semibold mb-6 pb-2 border-b border-border/40">
              Orders Ledger
            </h2>

            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No orders have been received yet.</p>
            ) : (
              <div className="overflow-x-auto pb-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="pb-3 pr-4">Order ID & Date</th>
                      <th className="pb-3 pr-4">Customer Details</th>
                      <th className="pb-3 pr-4">Items Summary</th>
                      <th className="pb-3 pr-4">Total & Method</th>
                      <th className="pb-3 pr-4 text-center">Order Status</th>
                      <th className="pb-3 text-center">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-muted/10 transition-colors">
                        {/* ID & Date */}
                        <td className="py-4 pr-4">
                          <p className="font-mono font-bold text-primary select-all text-sm mb-1">{o.orderId}</p>
                          <p className="text-[10px] text-muted-foreground">{o.date}</p>
                        </td>

                        {/* Customer Details */}
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-foreground">{o.deliveryDetails.fullName}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={o.deliveryDetails.addressLine1}>
                            {o.deliveryDetails.addressLine1}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Mob: {o.deliveryDetails.phone}</p>
                        </td>

                        {/* Items */}
                        <td className="py-4 pr-4">
                          <div className="max-w-[200px] space-y-1">
                            {o.items.map((item, idx) => (
                              <p key={idx} className="truncate text-muted-foreground text-[11px]">
                                • {item.name} <span className="font-bold text-foreground">({item.quantity}x)</span>
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Total & Method */}
                        <td className="py-4 pr-4">
                          <p className="font-bold text-foreground text-sm">₹{o.total}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{o.paymentMethod}</p>
                          {o.paymentProofUploaded && (
                            <span className="inline-block mt-1 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              Proof Uploaded
                            </span>
                          )}
                        </td>

                        <td className="py-4 pr-4 text-center">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.orderId, e.target.value as Order["status"])}
                            className="rounded-full border border-border/40 bg-background px-2 py-1.5 text-[10px] font-semibold text-foreground outline-none"
                          >
                            {statusOptions.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            ))}
                          </select>
                          <span className={`mt-1.5 block text-[9px] font-bold uppercase ${getStatusTextClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>

                        <td className="py-4 text-center">
                          {o.paymentMethod === "COD" ? (
                            <div className="space-y-1">
                              <span className="inline-flex rounded-full bg-muted/20 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                                COD
                              </span>
                              <p className="text-[9px] font-semibold uppercase text-muted-foreground">Fixed</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <select
                                value={o.paymentStatus}
                                onChange={(e) => updatePaymentStatus(o.orderId, e.target.value as Order["paymentStatus"])}
                                className="rounded-full border border-border/40 bg-background px-2 py-1.5 text-[10px] font-semibold text-foreground outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                              <p className="text-[9px] font-semibold uppercase text-muted-foreground">UPI Payment</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 3: PRODUCTS CATALOG ==================== */}
        {activeTab === "products" && (
          <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 animate-fade-up">
            <h2 className="font-serif text-xl text-foreground font-semibold mb-6 pb-2 border-b border-border/40">
              Product Checking & stock Editor
            </h2>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg text-foreground font-semibold">
                  Product Catalog
                </h3>
                <p className="text-xs text-muted-foreground">
                  Use the editor to update existing products or add new catalog items.
                </p>
              </div>
              <Button
                onClick={openAddProduct}
                className="rounded-full px-4 py-3 text-xs font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Product
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
              <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-lg shadow-primary/5">
                <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 scrollbar-hide border-r border-border/20">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => startEditing(p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                        editingProductId === p.id 
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border/50 bg-background hover:bg-muted/10"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-serif text-base text-foreground truncate font-normal">{p.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Tag: {p.tag} • Price: ₹{p.price}</p>
                        <p className="text-xs font-semibold text-primary mt-1">Stock Left: {p.quantityAvailable} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product editor panel */}
              <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-lg shadow-primary/5">
                {(isAddingProduct || editingProductId) ? (
                  <div className="space-y-4 animate-fade-up">
                    <h3 className="font-serif text-lg text-foreground mb-4 font-normal flex items-center gap-2">
                      {isAddingProduct ? (
                        <><Plus className="w-5 h-5 text-primary" /> Add New Product</>
                      ) : (
                        <><Edit className="w-5 h-5 text-primary" /> Edit: {products.find(p => p.id === editingProductId)?.name}</>
                      )}
                    </h3>

                    {isAddingProduct && (
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                          Product ID
                        </label>
                        <input
                          type="text"
                          value={editForm.id ?? ""}
                          onChange={(e) => setEditForm(prev => ({ ...prev, id: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                          placeholder="unique-product-id"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name ?? ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={editForm.tag ?? ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        Product Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                        className="w-full text-[11px] file:text-sm file:bg-primary file:text-primary-foreground file:px-3 file:py-2 file:rounded-full file:border-0 file:font-semibold"
                      />
                      <p className="text-[10px] text-muted-foreground mt-2">Upload only. The image file will be saved and displayed automatically.</p>
                      {editForm.image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-border/50 bg-background">
                          <img
                            src={editForm.image}
                            alt="Product preview"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.description ?? ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        Detailed Notes
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.details ?? ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, details: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                          Price (INR)
                        </label>
                        <input
                          type="number"
                          value={editForm.price ?? 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                          Quantity Available
                        </label>
                        <input
                          type="number"
                          value={editForm.quantityAvailable ?? 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, quantityAvailable: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                          Rating
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={editForm.rating ?? 4.8}
                          onChange={(e) => setEditForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                          Reviews Count
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={editForm.reviewsCount ?? 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, reviewsCount: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-border/70 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        onClick={() => isAddingProduct ? addNewProduct() : editingProductId ? saveProductEdits(editingProductId) : undefined}
                        className="w-full sm:w-auto rounded-full py-5 text-sm flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 mt-6 shadow-md"
                      >
                        {isAddingProduct ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />} 
                        {isAddingProduct ? "Create Product" : "Save Catalog Changes"}
                      </Button>

                      {editingProductId && (
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteProduct(editingProductId)}
                          className="w-full sm:w-auto rounded-full py-5 text-sm text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Product
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-40 text-secondary" />
                    <p className="text-sm font-medium">Select a product from the list to modify its image path, price, description or stock quantity.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: CUSTOMER MONITORING ==================== */}
        {activeTab === "customers" && (
          <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 animate-fade-up">
            <h2 className="font-serif text-xl text-foreground font-semibold mb-6 pb-2 border-b border-border/40">
              Customer Registry & Activity Logs
            </h2>

            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No customers have registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div key={u.id} className="p-5 rounded-2xl border border-border/50 bg-background flex flex-col justify-between shadow-sm relative overflow-hidden">
                    
                    {/* Status indicator on top corner */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        u.isLoggedIn ? "bg-emerald-500 animate-pulse" : "bg-muted"
                      }`} />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {u.isLoggedIn ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold font-mono bg-muted/65 text-muted-foreground px-2 py-0.5 rounded-full block w-max mb-3">
                        {u.id}
                      </span>
                      <h4 className="font-serif text-lg text-foreground font-normal mb-1">{u.name}</h4>
                      
                      <div className="text-xs space-y-1 text-muted-foreground mt-4">
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {u.email}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> {u.phone}
                        </p>
                        <p className="flex items-start gap-1.5 pt-1.5 border-t border-border/20 mt-2 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>
                            {u.addressLine1}{u.addressLine2 ? ', ' + u.addressLine2 : ''}, {u.district}, {u.state} - {u.pincode}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Customer</span>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="rounded-full px-4 py-3 text-xs text-destructive border-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      <Footer />
    </main>
  )
}
