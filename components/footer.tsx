import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  produits: [
    { label: "Triphala Shampoo", href: "#" },
    { label: "Hibiscus Oil", href: "#" },
    { label: "Goat Milk Soap", href: "#" },
    { label: "All products", href: "#products" },
  ],
  entreprise: [
    { label: "Our Story", href: "#mission" },
    { label: "About", href: "#science" },
    { label: "Values", href: "#" },
    { label: "Contact", href: "#" },
  ],
  ressources: [
    { label: "Herbal Guide", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Testimonials", href: "#temoignages" },
    { label: "Support", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-5sBgulAsPqf4pv7YQOhUYaTzWf957y.png"
                alt="Avizhtham Herbal's Clinic Logo"
                className="h-8 w-8"
              />
              <span className="font-serif text-xl font-medium text-background">Avizhtham Herbals</span>
            </Link>
            <p className="text-background/70 leading-relaxed mb-6 max-w-sm">
              Natural Healing Through Traditional Herbal Care. Pure herbs, powerful benefits, natural wellness.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>avizhthamherbals@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+91 98412 14222</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-background mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.produits.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">© 2025 Avizhtham Herbal&apos;s Clinic. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="#" className="hover:text-background transition-colors">
              Legal notice
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Privacy policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
