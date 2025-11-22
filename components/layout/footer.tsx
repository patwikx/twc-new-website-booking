'use client';

import Link from 'next/link';

interface FooterProps {
  siteName?: string;
  siteTagline?: string;
  properties?: Array<{ id: string; name: string; slug: string }>;
}

export default function Footer({ 
  siteName = 'Dolores', 
  siteTagline = 'HOTELS & RESORTS',
  properties = []
}: FooterProps) {
  return (
    <footer className="bg-muted/50 border-t mt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col mb-4">
              <span className="text-2xl font-display font-bold">{siteName}</span>
              <span className="text-xs tracking-widest text-muted-foreground">{siteTagline}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience luxury and comfort across our distinctive properties in the Philippines.
            </p>
          </div>

          {/* Properties */}
          {properties.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-muted-foreground mb-4 uppercase">
                Properties
              </h4>
              <ul className="space-y-3">
                {properties.map(p => (
                  <li key={p.id}>
                    <Link 
                      href={`/properties/${p.slug}`} 
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground mb-4 uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sm hover:text-primary transition-colors">
                  Our Properties
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground mb-4 uppercase">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+639177129217" 
                  className="text-sm hover:text-primary transition-colors"
                >
                  +63 917 712 9217
                </a>
              </li>
              <li>
                <a 
                  href="mailto:reservations@doloreshotels.com" 
                  className="text-sm hover:text-primary transition-colors"
                >
                  reservations@doloreshotels.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {siteName} Hotels & Resorts. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
