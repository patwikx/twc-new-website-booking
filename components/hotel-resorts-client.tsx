'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { HeroSlideData } from '@/actions/hero/get-hero-slides';
import type { SiteSettingsData } from '@/actions/site/get-site-settings';
import type { ContactInfoData } from '@/actions/contact/get-contact-info';
import type { ServiceData } from '@/actions/services/get-services';
import type { PropertyData } from '@/actions/properties/get-properties';

interface HotelResortsClientProps {
  heroSlides: HeroSlideData[];
  siteSettings: SiteSettingsData | null;
  contactInfo: ContactInfoData[];
  services: ServiceData[];
  properties: PropertyData[];
}

export default function HotelResortsClient({
  heroSlides,
  siteSettings,
  contactInfo,
  services,
  properties,
}: HotelResortsClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Default values
  const siteName = siteSettings?.siteName || 'Dolores';
  const establishedYear = siteSettings?.establishedYear || '2025';
  const aboutTitle = siteSettings?.aboutTitle || 'Where Every Stay Tells a Story';
  const aboutText1 = siteSettings?.aboutText1 || '';
  const aboutText2 = siteSettings?.aboutText2 || '';
  const ctaTitle = siteSettings?.ctaTitle || 'Your Perfect Escape Awaits';
  const ctaSubtitle = siteSettings?.ctaSubtitle || '';
  const ctaButtonText = siteSettings?.ctaButtonText || 'Make a Reservation';
  const contactTitle = siteSettings?.contactTitle || "Let's Start Planning Your Stay";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Slider */}
      {heroSlides.length > 0 && (
        <section className="relative pt-16">
          <div className="relative h-[90vh] overflow-hidden rounded-b-3xl">
            {/* Slides */}
            {heroSlides.map((slide, index) => {
              const slideImage = slide.images[0]?.url || '';
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
                  <img 
                    src={slideImage}
                    alt={slide.images[0]?.alt || slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6 z-20">
              <div className="max-w-4xl space-y-6">
                <p className="text-white/90 text-sm tracking-widest uppercase">Est. {establishedYear}</p>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                  {heroSlides[currentSlide]?.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                  {heroSlides[currentSlide]?.subtitle}
                </p>
                <Button size="lg" className="mt-8" asChild>
                  <Link href="/properties">
                    Explore Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Navigation */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
              Welcome to {siteName}
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {aboutTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {aboutText1}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {aboutText2}
              </p>
              <Button variant="outline" size="lg" className="mt-6" asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-16 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
              Discover
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each property is carefully curated to offer a unique experience
            </p>
          </div>

          <div className="space-y-12">
            {properties.map((property, index) => (
              <div 
                key={property.id}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-96 lg:h-auto ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img
                      src={property.mainImage}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 left-6">
                      <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">{property.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl lg:text-4xl font-display font-bold mb-3">
                      {property.name}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {property.tagline}
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 uppercase">
                          Property Features
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {property.amenities.slice(0, 6).map((amenity) => (
                            <div key={amenity.id} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>{amenity.name}</span>
                            </div>
                          ))}
                        </div>
                        {property.amenities.length > 6 && (
                          <p className="text-xs text-muted-foreground mt-3">
                            +{property.amenities.length - 6} more amenities
                          </p>
                        )}
                      </div>
                    )}

                    {/* Room Count */}
                    <div className="flex items-center gap-6 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{property.rooms.length}</span>
                        <span className="text-muted-foreground">Room Types</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">From ₱{Math.min(...property.rooms.map(r => r.basePrice)).toLocaleString()}</span>
                        <span className="text-muted-foreground">per night</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full lg:w-auto rounded-full" asChild>
                      <Link href={`/properties/${property.slug}`}>
                        Explore {property.name}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {properties.length > 6 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
                What We Offer
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Our Services
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group overflow-hidden rounded-2xl bg-card hover:shadow-lg transition-all"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-display font-bold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <Link
                      href={service.linkUrl}
                      className="inline-flex items-center text-sm font-medium hover:gap-2 transition-all"
                    >
                      {service.linkText}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {ctaTitle}
          </h2>
          <p className="text-xl mb-10 opacity-90">
            {ctaSubtitle}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/properties">
              {ctaButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      {contactInfo.length > 0 && (
        <section id="contact" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {contactTitle}
              </h2>
              <p className="text-xl text-muted-foreground">
                We're here to help you plan your perfect stay
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {contactInfo.map((contact) => (
                <div
                  key={contact.id}
                  className="p-8 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <h3 className="text-2xl font-display font-bold mb-6">
                    {contact.title}
                  </h3>
                  <div className="space-y-4">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span>{contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{contact.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
