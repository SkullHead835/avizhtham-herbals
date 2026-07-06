"use client"

import React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Truck
} from "lucide-react"

export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount 
  } = useShop()

  // Shipping cost (free threshold at ₹500, or simple free shipping for now)
  const shippingCost = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 49
  const taxCost = Math.round(cartSubtotal * 0.18) // 18% GST (medicinal tax/regulatory)
  const totalCost = cartSubtotal + shippingCost

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Cart Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full flex-grow">
        {/* Page title and breadcrumb */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Shopping Cart</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light">
            Your Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-card rounded-3xl border border-border/50 p-12 text-center max-w-2xl mx-auto shadow-lg shadow-primary/5 my-12 animate-fade-up">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-foreground mb-3">Your Cart is Empty</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
              Before checking out, you must add some of our premium herbal wellness products to your cart. Explore our natural formulations to start healing.
            </p>
            <Link href="/#products">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base group">
                Browse Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-lg shadow-primary/5">
                <div className="p-6 md:p-8 border-b border-border/40 hidden md:grid grid-cols-12 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-border/40">
                  {cartItems.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0"
                    >
                      {/* Product Details (Image & Name) */}
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/40 shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-1">
                            {item.product.tag}
                          </span>
                          <Link href={`/products/${encodeURIComponent(item.product.id)}`} className="font-serif text-foreground text-lg font-normal hover:text-primary transition-colors block leading-tight">
                            {item.product.name}
                          </Link>
                        </div>
                      </div>

                      {/* Item Price */}
                      <div className="col-span-1 md:col-span-2 md:text-center text-sm font-medium text-foreground flex md:block justify-between items-center">
                        <span className="md:hidden text-xs text-muted-foreground">Price</span>
                        <span>₹{item.product.price}</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-center items-center justify-between">
                        <span className="md:hidden text-xs text-muted-foreground">Quantity</span>
                        <div className="flex items-center border border-border/60 rounded-full bg-muted/20 px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Delete */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4 text-right">
                        <span className="md:hidden text-xs text-muted-foreground">Total</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-primary">₹{item.product.price * item.quantity}</span>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping button */}
              <div className="flex justify-between items-center pt-2">
                <Link href="/#products" className="text-sm font-semibold text-primary hover:underline">
                  &larr; Continue Shopping
                </Link>
                <span className="text-xs text-muted-foreground">
                  Prices are inclusive of standard packaging.
                </span>
              </div>
            </div>

            {/* Right: Summary panel */}
            <div className="lg:col-span-4">
              <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 sticky top-32">
                <h2 className="font-serif text-2xl text-foreground mb-6 font-normal pb-4 border-b border-border/40">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium text-foreground">₹{cartSubtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (GST 18%)</span>
                    <span className="font-medium text-foreground">₹{taxCost}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-foreground">
                      {shippingCost === 0 ? (
                        <span className="text-primary font-semibold">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="bg-primary/5 rounded-xl p-3 text-[11px] text-primary flex items-start gap-2">
                      <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Add ₹{500 - cartSubtotal} more for FREE shipping on your order.</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/40 flex justify-between text-base font-bold text-foreground">
                    <span>Total Amount</span>
                    <span className="text-lg text-primary">₹{totalCost + taxCost}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base shadow-md shadow-primary/10 flex items-center justify-center gap-2 group">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Trust Elements */}
                <div className="mt-6 pt-6 border-t border-border/40 space-y-3.5 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-primary" />
                    <span>Safe & Secure checkout experience</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4.5 h-4.5 text-primary" />
                    <span>Quick dispatch in eco-friendly packing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
