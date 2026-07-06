"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  ChevronRight, 
  MapPin, 
  Check, 
  Edit3, 
  CreditCard, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  FileImage,
  AlertCircle
} from "lucide-react"

// Types for form
interface DeliveryForm {
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  district: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, cartSubtotal, currentUser, placeOrder } = useShop()

  // Calculate pricing
  const shippingCost = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 49
  const taxCost = Math.round(cartSubtotal * 0.18)
  const totalCost = cartSubtotal + shippingCost + taxCost

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1) // 1, 2, 3, 4
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Form Fields state
  const [form, setForm] = useState<DeliveryForm>({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<DeliveryForm>>({})

  // Step 3: Payment selection state
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD")

  // Step 4: UPI Payment Proof upload
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  // Autofill fields if user is logged in
  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        addressLine1: currentUser.addressLine1 || "",
        addressLine2: currentUser.addressLine2 || "",
        district: currentUser.district || "",
        state: currentUser.state || "",
        pincode: currentUser.pincode || "",
      })
      toast.success("Autofilled delivery details from your account!")
    }
  }, [currentUser])

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep < 5) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          router.push("/cart")
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [cartItems, router, currentStep])

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof DeliveryForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProofImage(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success("Receipt uploaded successfully!")
    }
  }

  // Validate step 1
  const validateDeliveryDetails = (): boolean => {
    const errors: Partial<DeliveryForm> = {}
    if (!form.name.trim()) errors.name = "Name is required."
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required."
    } else if (!/^\d{10}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Enter a valid 10-digit phone number."
    }
    if (!form.email.trim()) {
      errors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Enter a valid email address."
    }
    if (!form.addressLine1.trim()) errors.addressLine1 = "Address Line 1 is required."
    if (!form.district.trim()) errors.district = "District is required."
    if (!form.state.trim()) errors.state = "State is required."
    if (!form.pincode.trim()) {
      errors.pincode = "Pincode is required."
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit pincode."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handlers for steps
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateDeliveryDetails()) {
      setCurrentStep(2)
    } else {
      toast.error("Please correct the errors in the form.")
    }
  }

  const handleStep2Confirm = () => {
    setCurrentStep(3)
  }

  const handleStep3Confirm = () => {
    setCurrentStep(4)
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === "UPI" && !proofImage) {
      toast.error("Please upload payment proof to confirm order.")
      return
    }

    setIsSubmitting(true)

    // Simulate server request
    await new Promise(resolve => setTimeout(resolve, 2000))

    const deliveryDetails = {
      fullName: form.name,
      phone: form.phone,
      email: form.email,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      district: form.district,
      state: form.state,
      pincode: form.pincode
    }

    // Call dynamic placeOrder in ShopProvider
    const newOrder = placeOrder(
      deliveryDetails,
      paymentMethod === "COD" ? "COD" : "UPI",
      !!proofImage
    )

    // Sync to sessionStorage for success receipt page rendering
    const orderSummary = {
      orderId: newOrder.orderId,
      date: newOrder.date,
      deliveryDetails: {
        fullName: form.name,
        phone: form.phone,
        email: form.email,
        address: `${form.addressLine1}${form.addressLine2 ? ', ' + form.addressLine2 : ''}, ${form.district}, ${form.state} - ${form.pincode}`
      },
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery (COD)" : "UPI Payment",
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      shipping: newOrder.shipping,
      tax: newOrder.tax,
      total: newOrder.total,
      paymentProofUploaded: !!proofImage
    }

    sessionStorage.setItem("avizhtham_latest_order", JSON.stringify(orderSummary))

    setIsSubmitting(false)
    toast.success("Order placed successfully!")
    router.push("/orders")
  }

  // Back button in stepper
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full flex-grow">
        {/* Stepper Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative flex justify-between items-center">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border/40 -translate-y-1/2 -z-10 rounded-full" />
            {/* Active Progress Line */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 -z-10 rounded-full transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {/* Steps */}
            {[
              { num: 1, label: "Delivery" },
              { num: 2, label: "Confirmation" },
              { num: 3, label: "Payment" },
              { num: 4, label: "Final Review" }
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center">
                <button
                  disabled={step.num > currentStep}
                  onClick={() => setCurrentStep(step.num)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    currentStep > step.num
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.num
                      ? "bg-background border-primary text-primary shadow-lg shadow-primary/10 scale-110"
                      : "bg-background border-border text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                </button>
                <span className={`text-xs mt-2.5 font-medium tracking-tight transition-colors hidden sm:inline ${
                  currentStep === step.num ? "text-primary font-bold" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Main Area Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Interactive Form Steps */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 min-h-[450px] flex flex-col">
              
              {/* BACK BUTTON within card */}
              {currentStep > 1 && (
                <button 
                  onClick={handleBackStep}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6 font-semibold"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Step {currentStep - 1}
                </button>
              )}

              {/* STEP 1: Delivery Details */}
              {currentStep === 1 && (
                <div className="animate-fade-up">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-2xl text-foreground font-normal">
                      Step 1: Delivery Details
                    </h2>
                    {!currentUser && (
                      <Link href="/login?redirect=/checkout" className="text-xs text-primary font-semibold hover:underline">
                        Sign In for autofill
                      </Link>
                    )}
                  </div>
                  
                  <form onSubmit={handleStep1Submit} className="space-y-5">
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                            formErrors.name ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                          }`}
                          placeholder="e.g. John Doe"
                        />
                        {formErrors.name && (
                          <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors.name}
                          </span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                            formErrors.phone ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                          }`}
                          placeholder="10-digit mobile number"
                        />
                        {formErrors.phone && (
                          <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                          formErrors.email ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                        }`}
                        placeholder="e.g. john@example.com"
                      />
                      {formErrors.email && (
                        <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label htmlFor="addressLine1" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                        Address Line 1 (Street Address/House no.)
                      </label>
                      <input
                        id="addressLine1"
                        name="addressLine1"
                        type="text"
                        value={form.addressLine1}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                          formErrors.addressLine1 ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                        }`}
                        placeholder="House no., street address, c/o"
                      />
                      {formErrors.addressLine1 && (
                        <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.addressLine1}
                        </span>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label htmlFor="addressLine2" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                        Address Line 2 (Apartment/Suite/Unit)
                      </label>
                      <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        value={form.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border/70 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        placeholder="Apartment, suite, unit, building, floor etc."
                      />
                    </div>

                    {/* District, State, Pincode Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label htmlFor="district" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                          District
                        </label>
                        <input
                          id="district"
                          name="district"
                          type="text"
                          value={form.district}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                            formErrors.district ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                          }`}
                          placeholder="District/City"
                        />
                        {formErrors.district && (
                          <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors.district}
                          </span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="state" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={form.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                            formErrors.state ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                          }`}
                          placeholder="State"
                        />
                        {formErrors.state && (
                          <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors.state}
                          </span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="pincode" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
                          Pincode
                        </label>
                        <input
                          id="pincode"
                          name="pincode"
                          type="text"
                          value={form.pincode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                            formErrors.pincode ? "border-destructive focus:ring-destructive/30" : "border-border/70"
                          }`}
                          placeholder="6 digits pincode"
                        />
                        {formErrors.pincode && (
                          <span className="text-xs text-destructive mt-1 block flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors.pincode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex justify-end">
                      <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 px-8 py-5 text-sm">
                        Continue to Confirmation &rarr;
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: Order Confirmation */}
              {currentStep === 2 && (
                <div className="animate-fade-up flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-border/40">
                      <h2 className="font-serif text-2xl text-foreground font-normal">
                        Step 2: Confirm Order Details
                      </h2>
                      <button 
                        onClick={() => setCurrentStep(1)} 
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Details
                      </button>
                    </div>

                    <div className="bg-muted/20 rounded-2xl p-6 border border-border/45 mb-8 space-y-4">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Shipping Address
                      </h3>
                      <div className="text-sm space-y-1.5">
                        <p className="font-semibold text-foreground">{form.name}</p>
                        <p className="text-muted-foreground">{form.addressLine1}</p>
                        {form.addressLine2 && <p className="text-muted-foreground">{form.addressLine2}</p>}
                        <p className="text-muted-foreground">
                          {form.district}, {form.state} - {form.pincode}
                        </p>
                        <p className="text-muted-foreground font-medium mt-2">Phone: {form.phone} | Email: {form.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Review Totals
                      </h3>
                      <div className="border border-border/40 rounded-2xl p-5 bg-background space-y-3">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Items Subtotal</span>
                          <span className="font-medium text-foreground">₹{cartSubtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Standard Tax (18% GST)</span>
                          <span className="font-medium text-foreground">₹{taxCost}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Shipping Fee</span>
                          <span className="font-medium text-foreground">
                            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                          </span>
                        </div>
                        <div className="border-t border-border/30 pt-3 flex justify-between text-base font-bold text-foreground">
                          <span>Grand Total Payment</span>
                          <span className="text-lg text-primary">₹{totalCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/40 flex justify-end gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push("/cart")} 
                      className="rounded-full px-6 py-5 border-border hover:bg-muted/25 text-sm"
                    >
                      Modify Items (Cart)
                    </Button>
                    <Button 
                      onClick={handleStep2Confirm}
                      className="rounded-full bg-primary hover:bg-primary/90 px-8 py-5 text-sm"
                    >
                      Confirm and Pay &rarr;
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Selection */}
              {currentStep === 3 && (
                <div className="animate-fade-up flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-6 font-normal pb-2 border-b border-border/40">
                      Step 3: Select Payment Method
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      {/* COD option */}
                      <button
                        onClick={() => setPaymentMethod("COD")}
                        className={`p-6 rounded-2xl border text-left flex flex-col transition-all duration-300 ${
                          paymentMethod === "COD"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/60 bg-background hover:bg-muted/10"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-4">
                          <span className="p-3 bg-muted rounded-xl text-foreground">
                            <CreditCard className="w-5 h-5" />
                          </span>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "COD" ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {paymentMethod === "COD" && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wider">
                          Cash on Delivery (COD)
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Pay in cash or card when package arrives. Standard processing apply.
                        </p>
                      </button>

                      {/* UPI Option */}
                      <button
                        onClick={() => setPaymentMethod("UPI")}
                        className={`p-6 rounded-2xl border text-left flex flex-col transition-all duration-300 ${
                          paymentMethod === "UPI"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/60 bg-background hover:bg-muted/10"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-4">
                          <span className="p-3 bg-muted rounded-xl text-foreground">
                            <QrCode className="w-5 h-5" />
                          </span>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "UPI" ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {paymentMethod === "UPI" && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wider">
                          UPI Payment (QR Code)
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Scan our QR code using any UPI app (GPay, PhonePe, Paytm). Safe & instant.
                        </p>
                      </button>
                    </div>

                    {/* QR Code section if UPI selected */}
                    {paymentMethod === "UPI" && (
                      <div className="bg-muted/15 rounded-2xl p-6 border border-border/40 text-center max-w-sm mx-auto animate-fade-up mb-6">
                        <div className="border-4 border-dashed border-primary/30 p-4 bg-background inline-block rounded-2xl mb-4">
                          {/* Visual simulator for UPI QR */}
                          <div className="w-48 h-48 bg-muted border border-border/60 flex flex-col items-center justify-center p-4 rounded-xl">
                            <QrCode className="w-24 h-24 text-foreground mb-2 opacity-80" />
                            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest leading-none">
                              SCAN TO PAY UPI
                            </span>
                            <span className="text-[9px] text-muted-foreground mt-1 select-all font-mono">
                              pay.avizhtham@upi
                            </span>
                          </div>
                        </div>
                        <h4 className="font-serif text-lg text-foreground font-normal mb-1">
                          Scan with your UPI App
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          Total amount to pay: <strong className="text-primary text-sm">₹{totalCost}</strong>
                        </p>
                        <div className="text-[10px] text-amber-600 bg-amber-50 rounded-xl p-2.5 font-medium inline-block border border-amber-200">
                          Please do not close this window after scanned. Proceed to final step.
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="pt-6 border-t border-border/40 flex justify-end mt-8">
                    <Button 
                      onClick={handleStep3Confirm}
                      className="rounded-full bg-primary hover:bg-primary/90 px-8 py-5 text-sm"
                    >
                      Proceed to Final Confirmation &rarr;
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Final Confirmation */}
              {currentStep === 4 && (
                <div className="animate-fade-up flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-6 font-normal pb-2 border-b border-border/40">
                      Step 4: Final Review & Confirmation
                    </h2>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Review */}
                        <div className="border border-border/40 rounded-2xl p-5 bg-muted/5">
                          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                            Shipping Details
                          </h4>
                          <div className="text-xs space-y-1 text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">{form.name}</p>
                            <p>{form.addressLine1}</p>
                            {form.addressLine2 && <p>{form.addressLine2}</p>}
                            <p>{form.district}, {form.state} - {form.pincode}</p>
                            <p className="mt-1 font-medium">Phone: {form.phone}</p>
                          </div>
                        </div>

                        {/* Payment Method Review */}
                        <div className="border border-border/40 rounded-2xl p-5 bg-muted/5">
                          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                            Payment Details
                          </h4>
                          <div className="text-xs space-y-1 text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                              {paymentMethod === "COD" ? "Cash on Delivery" : "UPI Direct Transfer"}
                            </p>
                            <p>Total Charge: <strong className="text-primary text-sm">₹{totalCost}</strong></p>
                            <p>Status: Pending verification</p>
                          </div>
                        </div>
                      </div>

                      {/* If UPI selected: require upload proof */}
                      {paymentMethod === "UPI" && (
                        <div className="border border-border/45 rounded-2xl p-6 bg-primary/5 animate-fade-up">
                          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Upload className="w-4 h-4 text-primary" />
                            Upload Payment Receipt
                          </h3>
                          <p className="text-xs text-muted-foreground mb-4">
                            Since you paid via UPI QR code, please upload a screenshot of your transaction receipt for quick verification.
                          </p>

                          <div className="flex flex-col items-center">
                            <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border/70 hover:border-primary rounded-2xl p-6 bg-background cursor-pointer transition-colors duration-300">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange} 
                                className="hidden" 
                              />
                              
                              {proofPreview ? (
                                <div className="text-center">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-2 border border-border/60">
                                    <img src={proofPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs font-semibold text-primary truncate max-w-[200px] block">
                                    {proofImage?.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                                    Click or drag to replace file
                                  </span>
                                </div>
                              ) : (
                                <div className="text-center flex flex-col items-center">
                                  <FileImage className="w-8 h-8 text-muted-foreground mb-2" />
                                  <span className="text-xs font-semibold text-foreground">
                                    Select transaction screenshot
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block mt-1">
                                    PNG, JPG up to 5MB
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/40 flex justify-end mt-8">
                    <Button 
                      disabled={isSubmitting}
                      onClick={handlePlaceOrder}
                      className="rounded-full bg-primary hover:bg-primary/90 px-10 py-6 text-base shadow-lg shadow-primary/10 transition duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Confirm Order & Place
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sticky Product Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-lg shadow-primary/5 sticky top-32">
              <h3 className="font-serif text-xl text-foreground font-normal pb-4 border-b border-border/40 mb-5">
                Items in Order
              </h3>
              
              <div className="max-h-[280px] overflow-y-auto pr-2 scrollbar-hide divide-y divide-border/30 mb-5">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-center gap-4 text-sm first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border/40 shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} &times; ₹{item.product.price}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground shrink-0">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/40 pt-4 space-y-2 text-xs text-muted-foreground font-medium">
                <div className="flex justify-between">
                  <span>Cart Items</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (18% GST)</span>
                  <span>₹{taxCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>
                <div className="border-t border-border/30 pt-3 flex justify-between text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-base text-primary">₹{totalCost}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
