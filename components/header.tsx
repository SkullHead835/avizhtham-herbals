"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, ChevronDown, LayoutGrid, ShoppingBag, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShop } from "@/components/shop-provider"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { currentUser, logoutUser } = useShop()

  const handleLogout = () => {
    logoutUser()
    setIsProfileOpen(false)
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between h-20 px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-5sBgulAsPqf4pv7YQOhUYaTzWf957y.png"
              alt="Avizhtham Herbal's Clinic Logo"
              className="h-8 w-8"
            />
            <span className="font-serif text-foreground text-xl font-normal">Avizhtham</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/#science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/#temoignages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="/#mission" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Our Story
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/10 px-3 py-2 text-sm text-foreground shadow-sm transition hover:bg-muted/20"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{currentUser.name ? currentUser.name.split(" ")[0] : "Profile"}</span>
                  <ChevronDown className={`h-4 w-4 transition ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur">
                    <div className="rounded-xl border border-border/40 bg-muted/10 px-3 py-3">
                      <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                      <p className="text-[11px] text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/10 hover:text-foreground" onClick={() => setIsProfileOpen(false)}>
                        <User className="h-4 w-4" /> Edit Profile
                      </Link>
                      <Link href="/cart" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/10 hover:text-foreground" onClick={() => setIsProfileOpen(false)}>
                        <ShoppingBag className="h-4 w-4" /> Cart
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/10 hover:text-foreground" onClick={() => setIsProfileOpen(false)}>
                        <ReceiptText className="h-4 w-4" /> My Orders
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/10 hover:text-foreground" onClick={() => setIsProfileOpen(false)}>
                          <LayoutGrid className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full px-5 text-xs text-muted-foreground hover:text-foreground">
                    Login
                  </Button>
                </Link>
                <Link href="/login?tab=register">
                  <Button className="rounded-full bg-primary px-5 text-xs text-primary-foreground hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button className="p-2 text-muted-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-6 px-6 lg:px-8 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/#products" className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Products
              </Link>
              <Link href="/#science" className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/#temoignages" className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Testimonials
              </Link>
              <Link href="/#mission" className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Our Story
              </Link>

              {currentUser ? (
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="text-sm font-semibold text-foreground">Logged in as: {currentUser.name}</div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="rounded-full border border-border/50 px-4 py-3 text-sm text-center text-foreground">
                      Edit Profile
                    </Link>
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="rounded-full border border-border/50 px-4 py-3 text-sm text-center text-foreground">
                      Cart
                    </Link>
                    <Link href="/orders" onClick={() => setIsOpen(false)} className="rounded-full border border-border/50 px-4 py-3 text-sm text-center text-foreground">
                      My Orders
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className="rounded-full border border-border/50 px-4 py-3 text-sm text-center text-foreground">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="rounded-full border border-destructive/20 px-4 py-3 text-sm text-center text-destructive">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full py-5 text-xs">
                      Login
                    </Button>
                  </Link>
                  <Link href="/login?tab=register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full bg-primary py-5 text-xs text-primary-foreground hover:bg-primary/90">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
