"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop, User } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Lock, Trash2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, updateUser, deleteUser } = useShop()

  const [profile, setProfile] = useState<Omit<User, "id" | "isLoggedIn">>({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    password: "",
  })

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?redirect=/profile")
      return
    }

    setProfile({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      addressLine1: currentUser.addressLine1,
      addressLine2: currentUser.addressLine2,
      district: currentUser.district,
      state: currentUser.state,
      pincode: currentUser.pincode,
      password: currentUser.password ?? "",
    })
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim() || !profile.addressLine1.trim() || !profile.district.trim() || !profile.state.trim() || !profile.pincode.trim()) {
      toast.error("Please complete all required fields before saving.")
      return
    }

    const success = updateUser(currentUser.id, {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      addressLine1: profile.addressLine1,
      addressLine2: profile.addressLine2,
      district: profile.district,
      state: profile.state,
      pincode: profile.pincode,
      password: profile.password,
    })

    if (!success) {
      toast.error("That email address is already in use. Choose another one.")
      return
    }

    toast.success("Profile updated successfully.")
  }

  const handleDeleteAccount = () => {
    if (!window.confirm("Delete your account permanently? This cannot be undone.")) {
      return
    }

    deleteUser(currentUser.id)
    toast.success("Your account has been deleted.")
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-32 pb-24 flex-grow">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-lg shadow-primary/5 animate-fade-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.3em] mb-2">Account Profile</p>
                <h1 className="font-serif text-3xl text-foreground font-light">Hi, {currentUser.name.split(" ")[0]}.</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Update your name, contact details, shipping address, or delete your account.
                </p>
              </div>
              <Button variant="outline" className="rounded-full px-5 py-4 text-sm" onClick={() => router.push("/")}>Return Home</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-4 top-4" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-border/70 bg-background px-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-4 top-4" />
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-2xl border border-border/70 bg-background px-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="9999988888"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-4 top-4" />
                    <input
                      type="password"
                      value={profile.password}
                      onChange={(e) => setProfile(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full rounded-2xl border border-border/70 bg-background px-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Address Line 1
                  </label>
                  <input
                    value={profile.addressLine1}
                    onChange={(e) => setProfile(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="House number, street"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Address Line 2
                  </label>
                  <input
                    value={profile.addressLine2}
                    onChange={(e) => setProfile(prev => ({ ...prev, addressLine2: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Apartment, landmark (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    District
                  </label>
                  <input
                    value={profile.district}
                    onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Chennai"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    State
                  </label>
                  <input
                    value={profile.state}
                    onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Tamil Nadu"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                    Pincode
                  </label>
                  <input
                    value={profile.pincode}
                    onChange={(e) => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="600001"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Saving updates will refresh your stored profile and retain your shopping session.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="rounded-full px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    className="rounded-full px-8 py-4 text-destructive border-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
