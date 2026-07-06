"use client"

import { useEffect, useRef } from "react"
import { ScrollBlurText } from "./scroll-blur-text"

const testimonials = [
  {
    quote:
      "Avizhtham's Triphala shampoo has transformed my hair! It's thicker, shinier, and healthier than ever. Pure natural ingredients that actually work.",
    author: "Priya M.",
    role: "Customer for 6 months",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "I was skeptical about herbal products, but Avizhtham proved me wrong. The hibiscus oil is amazing for hair growth. Highly recommend!",
    author: "Rajesh K.",
    role: "Customer for 8 months",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "Finally found a skincare brand that understands natural wellness. The goat milk soap is gentle yet effective. My skin has never felt better.",
    author: "Dr. Anjali S.",
    role: "Dermatologist",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote: "Avizhtham's commitment to purity and quality is unmatched. Every product delivers real results with zero harmful chemicals.",
    author: "Vikram P.",
    role: "Customer for 1 year",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote: "Natural healing that works. I trust Avizhtham with my family's wellness. Their products are investment in health, not just cosmetics.",
    author: "Meera D.",
    role: "Customer for 10 months",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed

      // Reset position when we've scrolled past half (since we duplicate content)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section ref={sectionRef} id="temoignages" className="py-24 bg-background overflow-hidden lg:py-32 lg:pb-0">
      {/* Section Header */}
      <div className="w-full">
        <div className="text-center mb-16 lg:mb-20 px-6">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            Customer Stories
          </p>
          <ScrollBlurText
            text="Testimonials From Our Community"
            className="font-serif text-3xl md:text-4xl text-foreground text-balance lg:text-7xl font-light"
          />
        </div>

        <div className="reveal opacity-0 animation-delay-400">
          <div ref={scrollRef} className="flex gap-6 overflow-x-hidden" style={{ scrollBehavior: "auto" }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-card rounded-2xl p-6 border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 my-6 py-10"
              >
                <blockquote className="font-serif text-base md:text-lg text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
