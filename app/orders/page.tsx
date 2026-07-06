"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { Package, CalendarDays, MapPin, CreditCard, Truck } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const { currentUser, orders } = useShop()

  const userOrders = orders.filter((order) => order.userId === currentUser?.id)

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-24 text-center">
          <h1 className="font-serif text-3xl text-foreground">My Orders</h1>
          <p className="mt-3 text-sm text-muted-foreground">Please log in to see your order history.</p>
          <Button onClick={() => router.push("/login?redirect=/orders")} className="mx-auto mt-6 rounded-full px-6">
            Sign In
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 pt-32 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order History</p>
            <h1 className="font-serif text-3xl text-foreground">My Orders</h1>
            <p className="mt-2 text-sm text-muted-foreground">Every order you place stays here with its latest delivery status.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card p-10 text-center shadow-lg shadow-primary/5">
            <Package className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-serif text-2xl text-foreground">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Place your first order and it will appear here immediately.</p>
            <Button onClick={() => router.push("/#products")} className="mt-6 rounded-full px-6">
              Shop Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div key={order.orderId} className="rounded-3xl border border-border/50 bg-card p-6 shadow-lg shadow-primary/5">
                <div className="flex flex-col gap-4 border-b border-border/40 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-bold text-primary">{order.orderId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {order.status}
                    </span>
                    <span className="rounded-full bg-muted/20 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Order Date</p>
                        <p>{order.date}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Ordered Items</p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={`${order.orderId}-${index}`} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-muted-foreground">Qty {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Delivery Address</p>
                        <p>{order.deliveryDetails.addressLine1}</p>
                        {order.deliveryDetails.addressLine2 ? <p>{order.deliveryDetails.addressLine2}</p> : null}
                        <p>{order.deliveryDetails.district}, {order.deliveryDetails.state} - {order.deliveryDetails.pincode}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CreditCard className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Payment Method</p>
                        <p>{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Truck className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Current Status</p>
                        <p>{order.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
