"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import { useShop } from "@/components/shop-provider"

export function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { products } = useShop()
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [activeCategory]) // Re-run observer when filtering changes

  const categories = ["All", "Wellness", "Skincare", "Hair Care", "Hair Growth"]

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.tag === activeCategory)

  return (
    <section ref={sectionRef} id="products" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            Our Products
          </p>
          <ScrollBlurText
            text="Herbal Wellness Products"
            className="font-serif text-3xl text-foreground text-balance mb-6 md:text-7xl font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Each product is crafted with pure herbal ingredients and traditional wisdom, bringing natural healing to your daily life.
          </p>
        </div>

        {/* Category Filters */}
        <div className="reveal opacity-0 animation-delay-200 flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`reveal opacity-0 group`}
              style={{ animationDelay: `${(index % 4) * 150}ms` }}
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted z-10">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full z-10 shadow-sm border border-border/30">
                    {product.tag}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-foreground text-xl font-normal tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-lg font-semibold text-primary">₹{product.price}</span>
                    <Link href={`/products/${encodeURIComponent(product.id)}`}>
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto group/btn flex items-center gap-1.5"
                      >
                        Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
