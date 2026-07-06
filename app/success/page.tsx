"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  CreditCard,
  ChevronRight,
  ShieldCheck
} from "lucide-react"

interface OrderDetails {
  orderId: string
  date: string
  deliveryDetails: {
    fullName: string
    phone: string
    email: string
    address: string
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
  paymentProofUploaded: boolean
}

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    try {
      const storedOrder = sessionStorage.getItem("avizhtham_latest_order")
      if (storedOrder) {
        setOrder(JSON.parse(storedOrder))
      }
    } catch (e) {
      console.error("Failed to load order info", e)
    }
  }, [])

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-3">No Active Order Found</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            You do not have any recently placed orders or your order session has expired.
          </p>
          <Link href="/">
            <Button className="rounded-full bg-primary text-primary-foreground">
              Return to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full flex-grow flex flex-col items-center">
        {/* Animated Checkmark Icon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 relative animate-bounce">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <p className="text-secondary text-sm uppercase tracking-[0.2em] font-semibold mb-2">
            Thank you for your order!
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground font-light text-balance">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mt-3 leading-relaxed">
            Your herbal wellness order is now being processed by our clinical pharmacist. A confirmation email and SMS with dispatch tracking will be sent shortly.
          </p>
        </div>

        {/* Receipt Container */}
        <div className="w-full bg-card rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5 mb-10 animate-fade-up">
          {/* Receipt Top Header */}
          <div className="p-6 md:p-8 bg-muted/20 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Order Reference
              </span>
              <span className="font-mono text-xl font-bold text-primary select-all">
                {order.orderId}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>Placed on: {order.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Verified Purchase</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border/40">
            {/* Delivery address */}
            <div>
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              <div className="text-sm space-y-1.5">
                <p className="font-semibold text-foreground">{order.deliveryDetails.fullName}</p>
                <p className="text-muted-foreground leading-relaxed">{order.deliveryDetails.address}</p>
                <p className="text-muted-foreground font-medium">Mob: {order.deliveryDetails.phone}</p>
                <p className="text-muted-foreground">{order.deliveryDetails.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Details
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center bg-muted/10 p-3 rounded-xl border border-border/30">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                    {order.paymentMethod}
                  </span>
                </div>
                {order.paymentProofUploaded && (
                  <div className="bg-primary/5 border border-primary/20 text-primary text-xs rounded-xl p-3 font-semibold text-center">
                    Payment proof uploaded successfully
                  </div>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Medicinal formulations are prepared and verified in accordance with traditional ayurvedic quality checks.
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="p-6 md:p-8">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-6">
              Purchased Formulations
            </h3>
            
            <div className="divide-y divide-border/30 mb-8">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex items-center justify-between gap-4 text-sm first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border/40 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-foreground font-normal leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quantity: {item.quantity} &times; ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations receipt style */}
            <div className="border-t border-dashed border-border/60 pt-6 max-w-sm ml-auto space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-medium text-foreground">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span className="font-medium text-foreground">₹{order.tax}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Standard Delivery</span>
                <span className="font-medium text-foreground">
                  {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                </span>
              </div>
              <div className="border-t border-border/40 pt-4 flex justify-between text-base font-bold text-foreground">
                <span>Amount Paid</span>
                <span className="text-xl text-primary">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button className="rounded-full bg-primary hover:bg-primary/90 px-8 py-6 text-base shadow-md shadow-primary/10">
              Continue Shopping
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => window.print()}
            className="rounded-full px-8 py-6 text-base border-border hover:bg-muted/15"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
