export interface Product {
  id: string
  name: string
  price: number
  tag: string
  description: string
  details: string
  rating: number
  reviewsCount: number
  image: string
  gallery: string[]
}

export const products: Product[] = [
  {
    id: "vitality-capsules",
    name: "Avizhtham Vitality Capsules",
    price: 499,
    tag: "Wellness",
    description: "Premium herbal blend of Ashwagandha and Shatavari for daily strength, immunity, and enhanced vitality.",
    details: "Avizhtham Vitality Capsules represent the pinnacle of traditional herbal rejuvenation. Formulated with carefully selected adaptogens like organic Ashwagandha, Shatavari, Safed Musli, and Gokshura, this daily supplement naturally enhances energy levels, strengthens immune response, reduces fatigue, and helps the body manage everyday stress. It is 100% natural, vegan-friendly, and free from synthetic additives, heavy metals, or chemical preservatives.",
    rating: 4.8,
    reviewsCount: 142,
    image: "/images/product-capsules.png",
    gallery: [
      "/images/product-capsules.png",
      "/images/product-soap-box.png",
      "/images/product-equilibrium.png"
    ]
  },
  {
    id: "nourishing-hair-oil",
    name: "Avizhtham Nourishing Hair Oil",
    price: 349,
    tag: "Hair Care",
    description: "Traditional formulation enriched with Jojoba, Argan, and pure herbs for lustrous, strong hair.",
    details: "Our Nourishing Hair Oil combines the power of cold-pressed oils with traditional Ayurvedic herbs. Infused with extracts of Bringharaj, Amalaki, Jojoba, and Argan, this golden elixir deeply penetrates the scalp to nourish hair roots, arrest hair fall, prevent premature greying, and eliminate dryness. Massage gently onto your scalp twice a week for thick, shiny, and strong hair that radiates natural health.",
    rating: 4.9,
    reviewsCount: 204,
    image: "/images/product-hair-oil-bottle.png",
    gallery: [
      "/images/product-hair-oil-bottle.png",
      "/images/product-hibiscus.png",
      "/images/product-serenity.png"
    ]
  },
  {
    id: "herbal-bath-soap-kit",
    name: "Avizhtham Herbal Bath Soap Kit",
    price: 599,
    tag: "Skincare",
    description: "A deluxe set of 4 handcrafted natural soaps, gentle on skin and infused with pure essential oils.",
    details: "Indulge in a premium therapeutic bathing experience with our handcrafted soap kit. This set features four unique herbal bars: Goat Milk & Honey, Aloe Vera & Cucumber, Vetiver & Sandalwood, and Charcoal Mint. Cold-processed over 6 weeks to preserve natural glycerin, these soaps cleanse gently without drying, keeping your skin's natural moisture barrier intact. Rich in vitamins, antioxidants, and skin-softening nutrients.",
    rating: 4.7,
    reviewsCount: 98,
    image: "/images/product-bath-soaps.png",
    gallery: [
      "/images/product-bath-soaps.png",
      "/images/product-black-soap.png",
      "/images/product-soap-box.png"
    ]
  },
  {
    id: "charcoal-neem-soap",
    name: "Charcoal & Neem Detox Soap",
    price: 199,
    tag: "Skincare",
    description: "Activated charcoal and neem oil soap for deep pore cleansing, acne control, and skin purification.",
    details: "Formulated for deep detoxification, this soap combines the drawing power of activated charcoal with the antibacterial properties of pure Neem oil. It acts like a magnet to extract deep-seated impurities, excess sebum, and environmental toxins from your pores, while neem heals blemishes and prevents breakouts. Recommended for daily use on acne-prone or oily skin types.",
    rating: 4.6,
    reviewsCount: 115,
    image: "/images/product-black-soap.png",
    gallery: [
      "/images/product-black-soap.png",
      "/images/product-soap-box.png",
      "/images/product-bath-soaps.png"
    ]
  },
  {
    id: "premium-soap-box",
    name: "Avizhtham Premium Soap Box",
    price: 249,
    tag: "Skincare",
    description: "Single bar premium sandalwood and saffron soap packaged in our signature eco-friendly gift box.",
    details: "This single-bar package features our flagship Sandalwood & Kashmiri Saffron skin brightening soap. Beautifully enclosed in our signature, eco-friendly pressed paper box, it makes the perfect gift for yourself or a loved one. Rich in sandalwood paste and authentic saffron threads, it improves skin texture, reduces tan, and provides a soothing woody aroma that stays on you all day.",
    rating: 4.8,
    reviewsCount: 76,
    image: "/images/product-soap-box.png",
    gallery: [
      "/images/product-soap-box.png",
      "/images/product-bath-soaps.png",
      "/images/product-black-soap.png"
    ]
  },
  {
    id: "triphala-shampoo",
    name: "Triphala Nourishing Shampoo",
    price: 299,
    tag: "Hair Care",
    description: "Traditional herbal formula for deep scalp nourishment, hair growth, and dandruff control.",
    details: "Avizhtham Triphala Shampoo is crafted using an ancient decoction process of three potent fruits: Amalaki (Indian Gooseberry), Bibhitaki, and Haritaki. Rich in Vitamin C and essential antioxidants, it strengthens hair follicles from root to tip, curbs hair fall, maintains scalp pH balance, and leaves hair feeling incredibly soft, bouncy, and manageable. Free from sulfates, parabens, and synthetic colorants.",
    rating: 4.6,
    reviewsCount: 85,
    image: "/images/product-triphala.png",
    gallery: [
      "/images/product-triphala.png",
      "/images/product-bath-soaps.png"
    ]
  },
  {
    id: "hibiscus-oil",
    name: "Hibiscus Hair Growth Oil",
    price: 249,
    tag: "Hair Growth",
    description: "100% natural hair growth formula enriched with hibiscus flower extracts and sesame oil.",
    details: "A rich red hair elixir brewed under the hot sun using organic Hibiscus flowers and cooling Vetiver roots infused into pure, cold-pressed sesame oil. Hibiscus is rich in amino acids that nourish hair, stimulate regrowth from dormant follicles, and prevent premature thinning. Regular application cooling down the head, relieves stress, and gives you dark, thick, healthy hair.",
    rating: 4.8,
    reviewsCount: 142,
    image: "/images/product-hibiscus.png",
    gallery: [
      "/images/product-hibiscus.png",
      "/images/product-hair-oil-bottle.png"
    ]
  },
  {
    id: "goat-milk-soap",
    name: "Handmade Goat Milk Soap",
    price: 199,
    tag: "Skincare",
    description: "Handcrafted natural soap with pure goat milk and raw honey for sensitive, dry skin.",
    details: "Handmade in small batches, this soap blends fresh, pure goat milk with wild forest raw honey and cold-pressed coconut oil. Goat milk is loaded with natural lactic acid that gently dissolves dead skin, while its high fat content hydrates deeply. Perfect for dry, itchy, or highly sensitive skin conditions like eczema or psoriasis. Leaves skin hydrated and velvety soft.",
    rating: 4.7,
    reviewsCount: 95,
    image: "/images/product-goatsoap.png",
    gallery: [
      "/images/product-goatsoap.png",
      "/images/product-bath-soaps.png"
    ]
  }
]
