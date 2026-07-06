"use client"

import React, { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/components/shop-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  Star, 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  ChevronRight,
  RotateCcw,
  Truck
} from "lucide-react"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params)
  const router = useRouter()
  const { addToCart, products, isLoaded } = useShop()
  
  const normalizedId = decodeURIComponent(id).trim()
  const product = products.find(
    (p) => p.id.trim().toLowerCase() === normalizedId.toLowerCase()
  )
  const [activeImage, setActiveImage] = useState("")

  useEffect(() => {
    if (product) {
      setActiveImage(product.image)
    }
  }, [product])

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="h-4 w-48 rounded-full bg-muted animate-pulse mb-4" />
          <div className="h-4 w-64 rounded-full bg-muted animate-pulse mb-4" />
          <div className="h-20 w-full max-w-xl rounded-3xl bg-muted animate-pulse" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-3xl mb-4 text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
          <Link href="/">
            <Button className="rounded-full bg-primary text-primary-foreground">
              Return to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // Related products (exclude current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`, {
      description: "You can view your items in the shopping cart.",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      }
    })
  }

  const handleBuyNow = () => {
    addToCart(product, 1)
    router.push("/cart")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Breadcrumbs / Back button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-6 w-full">
        <div className="flex items-center justify-between">
          <Link 
            href="/#products" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#products" className="hover:text-foreground">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Split Details */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Large Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-muted border border-border/40 shadow-inner group">
              <img
                src={activeImage || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-primary/95 text-primary-foreground backdrop-blur-sm text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
                {product.tag}
              </span>
            </div>
            
            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-24 h-20 md:w-32 md:h-24 rounded-2xl overflow-hidden bg-muted border-2 transition-all shrink-0 ${
                      activeImage === imgUrl 
                        ? "border-primary shadow-md scale-95" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Tag / Category */}
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase mb-2">
              Avizhtham {product.tag} Collection
            </span>
            
            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border/40">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 fill-current ${
                      i < Math.floor(product.rating) ? "text-amber-500" : "text-muted/40"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground line-through">₹{Math.floor(product.price * 1.3)}</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                Save ~23%
              </span>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Scrollable Detailed Info Section */}
            <div className="border border-border/55 rounded-2xl p-5 mb-8 bg-muted/10">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                Product Details & Formulation
              </h3>
              <div className="max-h-[160px] overflow-y-auto scrollbar-hide text-sm text-muted-foreground leading-relaxed pr-2 space-y-3">
                <p>{product.details}</p>
                <div className="pt-2 border-t border-border/30 grid grid-cols-2 gap-4 text-xs font-medium text-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>100% Organic & Pure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Clinically Tested</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 rounded-full py-6 text-base border-primary text-primary hover:bg-primary/5 hover:text-primary transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 rounded-full py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all duration-300"
              >
                Buy Now
              </Button>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border/40 text-center">
              <div className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <Truck className="w-5 h-5 text-secondary mb-1" />
                <span>Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <ShieldCheck className="w-5 h-5 text-secondary mb-1" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <RotateCcw className="w-5 h-5 text-secondary mb-1" />
                <span>Easy Returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-muted/20 border-t border-border/40 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-foreground font-light mb-10">
            Related Products
          </h2>
          
          {/* Horizontal Scroll container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 snap-center flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-background/90 text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full border border-border/30">
                    {p.tag}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-foreground text-lg font-normal mb-2 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                    <span className="font-semibold text-primary">₹{p.price}</span>
                    <Link href={`/products/${encodeURIComponent(p.id)}`}>
                      <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-medium text-sm flex items-center gap-1">
                        View Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
