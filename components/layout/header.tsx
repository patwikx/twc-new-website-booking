'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeaderProps {
  siteName?: string;
  siteTagline?: string;
}

export default function Header({ siteName = 'Dolores', siteTagline = 'HOTELS & RESORTS' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-display font-bold">{siteName}</span>
          <span className="text-xs tracking-widest text-muted-foreground">{siteTagline}</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/properties" className="text-sm font-medium hover:text-primary transition-colors">
            Properties
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Button size="sm" className="rounded-full" asChild>
            <Link href="/properties">Book Now</Link>
          </Button>
        </div>
        
        <button 
          className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            <Link 
              href="/properties" 
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Properties
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/#contact" 
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Button size="sm" className="rounded-full w-full" asChild>
              <Link href="/properties">Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
