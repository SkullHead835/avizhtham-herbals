"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Chrome
} from "lucide-react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const tabParam = searchParams.get("tab")
  const { currentUser, loginUser, registerUser } = useShop()

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  useEffect(() => {
    if (tabParam === "register") {
      setActiveTab("register")
    } else {
      setActiveTab("login")
    }
  }, [tabParam])

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push(redirect)
    }
  }, [currentUser, router, redirect])

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle Input Changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please enter both email and password.")
      return
    }

    const success = loginUser(loginEmail, loginPassword)
    if (success) {
      const isAdmin = loginEmail.toLowerCase() === "admin@gmail.com" && loginPassword === "admin@123"
      toast.success(isAdmin ? "Welcome Admin!" : "Successfully logged in!")
      router.push(isAdmin ? "/admin" : redirect)
    } else {
      toast.error("Invalid email or password.")
    }
  }

  // Validate Register Form
  const validateRegister = () => {
    const newErrors: Record<string, string> = {}
    if (!registerForm.name.trim()) newErrors.name = "Name is required."
    if (!registerForm.phone.trim()) {
      newErrors.phone = "Mobile number is required."
    } else if (!/^\d{10}$/.test(registerForm.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit mobile number."
    }
    if (!registerForm.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = "Enter a valid email address."
    }
    if (!registerForm.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required."
    if (!registerForm.district.trim()) newErrors.district = "District is required."
    if (!registerForm.state.trim()) newErrors.state = "State is required."
    if (!registerForm.pincode.trim()) {
      newErrors.pincode = "Pincode is required."
    } else if (!/^\d{6}$/.test(registerForm.pincode.trim())) {
      newErrors.pincode = "Pincode must be exactly 6 digits."
    }
    if (!registerForm.password.trim()) {
      newErrors.password = "Password is required."
    } else if (registerForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) {
      toast.error("Please fill in all required fields correctly.")
      return
    }

    const success = registerUser(registerForm)
    if (success) {
      toast.success("Account created successfully!")
      router.push(redirect)
    } else {
      toast.error("This email is already registered.")
    }
  }

  // Social log-in simulator
  const handleSocialLogin = (platform: "Google" | "Apple") => {
    toast.info(`Connecting to ${platform}...`, {
      description: `Simulating ${platform} account login process.`
    })
    setTimeout(() => {
      const dummyUser = {
        name: `Social User (${platform})`,
        phone: "9999988888",
        email: `social_${platform.toLowerCase()}@example.com`,
        addressLine1: "10 Main Street",
        addressLine2: "Suite 4B",
        district: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
        password: "social_login_dummy",
      }
      const wasRegistered = registerUser(dummyUser)
      if (!wasRegistered) {
        loginUser(dummyUser.email)
      }
      toast.success(`Logged in with ${platform}!`)
      router.push(redirect)
    }, 1500)
  }

  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5 p-8 animate-fade-up">
      {/* Card Headers / Tab triggers */}
      <div className="flex border-b border-border/40 mb-8 pb-1">
        <button
          onClick={() => { setActiveTab("login"); setErrors({}) }}
          className={`flex-1 text-center pb-4 text-base font-semibold border-b-2 transition-all duration-300 ${
            activeTab === "login"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => { setActiveTab("register"); setErrors({}) }}
          className={`flex-1 text-center pb-4 text-base font-semibold border-b-2 transition-all duration-300 ${
            activeTab === "register"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* TAB 1: LOGIN FORM */}
      {activeTab === "login" && (
        <div className="animate-fade-up">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-foreground font-normal">Welcome Back</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Access your Avizhtham account to manage orders and track health cards.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginEmail" className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="loginEmail"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  placeholder="e.g. name@example.com"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="loginPassword" className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  placeholder="Enter password"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-sm flex items-center justify-center gap-2 mt-6">
              <LogIn className="w-4 h-4" /> Log In
            </Button>
          </form>
        </div>
      )}

      {/* TAB 2: REGISTER FORM */}
      {activeTab === "register" && (
        <div className="animate-fade-up">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-foreground font-normal">Create Account</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Fill in your details once. We will autofill them next time you order!
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
            {/* Name */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.name ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="e.g. Jane Doe"
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && <span className="text-[10px] text-destructive mt-0.5 block">{errors.name}</span>}
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                      errors.phone ? "border-destructive" : "border-border/70"
                    }`}
                    placeholder="10-digit mobile"
                  />
                  <Phone className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && <span className="text-[10px] text-destructive mt-0.5 block">{errors.phone}</span>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                      errors.email ? "border-destructive" : "border-border/70"
                    }`}
                    placeholder="e.g. email@domain.com"
                  />
                  <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.email && <span className="text-[10px] text-destructive mt-0.5 block">{errors.email}</span>}
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Address Line 1 *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="addressLine1"
                  value={registerForm.addressLine1}
                  onChange={handleRegisterChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.addressLine1 ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="Flat/House no., building, street address"
                />
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.addressLine1 && <span className="text-[10px] text-destructive mt-0.5 block">{errors.addressLine1}</span>}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Address Line 2 (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="addressLine2"
                  value={registerForm.addressLine2}
                  onChange={handleRegisterChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/70 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10"
                  placeholder="Landmark, area, sector"
                />
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" opacity="0.6" />
              </div>
            </div>

            {/* District, State, Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 truncate">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={registerForm.district}
                  onChange={handleRegisterChange}
                  className={`w-full px-2.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.district ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="City/Dist"
                />
                {errors.district && <span className="text-[9px] text-destructive mt-0.5 block">{errors.district}</span>}
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 truncate">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={registerForm.state}
                  onChange={handleRegisterChange}
                  className={`w-full px-2.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.state ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="State"
                />
                {errors.state && <span className="text-[9px] text-destructive mt-0.5 block">{errors.state}</span>}
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 truncate">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={registerForm.pincode}
                  onChange={handleRegisterChange}
                  className={`w-full px-2.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.pincode ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="6 digits"
                />
                {errors.pincode && <span className="text-[9px] text-destructive mt-0.5 block">{errors.pincode}</span>}
              </div>
            </div>

            {/* Password Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Choose Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground bg-muted/10 ${
                    errors.password ? "border-destructive" : "border-border/70"
                  }`}
                  placeholder="Min 6 characters"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && <span className="text-[10px] text-destructive mt-0.5 block">{errors.password}</span>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-sm flex items-center justify-center gap-2 mt-4">
              <UserPlus className="w-4 h-4" /> Create Account
            </Button>
          </form>
        </div>
      )}

      {/* Social Sign-In Splitter */}
      <div className="my-6 flex items-center justify-center gap-4">
        <span className="h-[1px] bg-border/50 flex-grow" />
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Or</span>
        <span className="h-[1px] bg-border/50 flex-grow" />
      </div>

      {/* Social Logins */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("Google")}
          className="flex-1 rounded-xl border-border/70 py-5 text-xs hover:bg-muted/15 flex items-center justify-center gap-2 text-foreground"
        >
          <Chrome className="w-4 h-4 text-red-500" />
          <span>Continue with Google</span>
        </Button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-md w-full mx-auto px-6 pt-32 pb-24 flex-grow flex flex-col justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
