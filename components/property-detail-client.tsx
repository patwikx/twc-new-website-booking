'use client';

import { useState } from 'react';
import { MapPin, Users, Bed, Maximize2, ArrowRight, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { PropertyDetailData } from '@/actions/properties/get-property-detail';
import type { SiteSettingsData } from '@/actions/site/get-site-settings';

interface PropertyDetailClientProps {
  property: PropertyDetailData;
  siteSettings: SiteSettingsData | null;
}

export default function PropertyDetailClient({
  property,
  siteSettings,
}: PropertyDetailClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomSelectionOpen, setRoomSelectionOpen] = useState(false);

  const siteName = siteSettings?.siteName || 'Dolores';
  const siteTagline = siteSettings?.siteTagline || 'HOTELS & RESORTS';

  const allImages = [property.mainImage, ...property.images.map(img => img.url)];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-background pt-16">

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden rounded-b-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
          <img 
            src={property.mainImage}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex items-end justify-start px-6 lg:px-12 pb-12 z-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-card/95 backdrop-blur-sm px-4 py-2 mb-4 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-3 leading-tight">
                {property.name}
              </h1>
              <p className="text-xl text-white/95">
                {property.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-foreground transition">Properties</Link>
            <span>/</span>
            <span className="text-foreground">{property.name}</span>
          </div>
        </div>
      </section>

      {/* Property Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 leading-tight">
                About This Property
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {property.description}
              </p>
              
              <div className="space-y-3">
                <h3 className="text-lg font-display font-bold mb-2">Property Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary text-primary-foreground p-6 rounded-2xl">
                <h3 className="text-xl font-display font-bold mb-3">Ready to Book?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Experience luxury and comfort at {property.name}. Book your stay today.
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() => setRoomSelectionOpen(true)}
                >
                  Check Availability
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="border-2 rounded-2xl p-6 bg-card">
                <h3 className="text-lg font-display font-bold mb-3">Quick Info</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold text-right">{property.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Room Types</span>
                    <span className="font-semibold">{property.rooms.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Starting From</span>
                    <span className="font-semibold">₱{Math.min(...property.rooms.map(r => r.basePrice)).toLocaleString()}/night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {/* Photo Gallery - Auto-scrolling */}
      <section className="py-16 bg-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">Gallery</p>
            <h2 className="text-4xl lg:text-5xl font-display font-bold">
              Explore {property.name}
            </h2>
          </div>
        </div>

        {/* Auto-scrolling horizontal gallery */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-left hover:pause-animation">
            {/* Duplicate images for seamless loop */}
            {[...allImages, ...allImages].map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index % allImages.length)}
                className="relative flex-shrink-0 w-[400px] h-[300px] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all z-10" />
                <img 
                  src={image}
                  alt={`${property.name} - Image ${(index % allImages.length) + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <Maximize2 className="w-6 h-6 text-foreground" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add CSS animation */}
        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          
          .pause-animation:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Rooms Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="font-body text-sm tracking-widest text-neutral-500 mb-3">ACCOMMODATIONS</p>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4">
              Our Rooms & Suites
            </h2>
            <p className="text-xl font-body text-neutral-600 max-w-2xl mx-auto">
              Choose from our selection of beautifully appointed rooms
            </p>
          </div>

          <div className="space-y-16">
            {property.rooms.map((room, index) => {
              const roomImage = room.images[0]?.url || property.mainImage;
              
              return (
                <div 
                  key={room.id}
                  className="group"
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                    <div className="w-full lg:w-1/2">
                      <div className="relative overflow-hidden shadow-2xl rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent z-10" />
                        <img 
                          src={roomImage}
                          alt={room.name}
                          className="w-full h-[400px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                          <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full">
                            <span className="font-body text-xs font-semibold text-neutral-900 tracking-wider">
                              {room.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div>
                        <h3 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-3 leading-tight">
                          {room.name}
                        </h3>
                        <div className="w-16 h-1 bg-neutral-900 mb-4"></div>
                        <p className="text-lg font-body text-neutral-700 leading-relaxed">
                          {room.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-200">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-neutral-600" />
                          <div>
                            <p className="text-xs font-body text-neutral-500 tracking-wider">MAX GUESTS</p>
                            <p className="font-body font-semibold text-neutral-900">{room.maxGuests} Guests</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Bed className="w-5 h-5 text-neutral-600" />
                          <div>
                            <p className="text-xs font-body text-neutral-500 tracking-wider">BED TYPE</p>
                            <p className="font-body font-semibold text-neutral-900">{room.bedConfiguration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Maximize2 className="w-5 h-5 text-neutral-600" />
                          <div>
                            <p className="text-xs font-body text-neutral-500 tracking-wider">ROOM SIZE</p>
                            <p className="font-body font-semibold text-neutral-900">{room.size} m²</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-neutral-600"></div>
                          </div>
                          <div>
                            <p className="text-xs font-body text-neutral-500 tracking-wider">AVAILABLE</p>
                            <p className="font-body font-semibold text-neutral-900">{room.totalRooms} Rooms</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-body tracking-wider text-neutral-500 mb-3">ROOM AMENITIES</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity) => (
                            <span 
                              key={amenity.id} 
                              className="px-3 py-1.5 bg-white border border-neutral-300 rounded-full font-body text-xs tracking-wider text-neutral-700 hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="font-body text-xs text-neutral-500 mb-1 tracking-wider">FROM</p>
                          <p className="text-3xl font-display font-bold text-neutral-900">
                            ₱{room.basePrice.toLocaleString()}
                          </p>
                          <p className="font-body text-xs text-neutral-500">per night</p>
                        </div>
                        <Button 
                          size="lg"
                          className="bg-neutral-900 hover:bg-black text-white px-8 font-body tracking-wider transition-all"
                          asChild
                        >
                          <Link href={`/properties/${property.slug}/rooms/${room.slug}`}>
                            View Details
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
            Ready to Experience<br />{property.name}?
          </h2>
          <p className="text-xl font-body text-neutral-300 mb-8">
            Book your stay today and create unforgettable memories
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              className="bg-white hover:bg-neutral-100 text-neutral-900 px-10 py-6 font-body tracking-wider transition-all"
              onClick={() => setRoomSelectionOpen(true)}
            >
              Check Availability
            </Button>
            <Button 
              size="lg"
              variant="outline"
 className="bg-white hover:bg-neutral-100 text-neutral-900 px-10 py-6 font-body tracking-wider transition-all"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Room Selection Dialog */}
      {roomSelectionOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-display font-bold">Select a Room</h2>
              <button
                onClick={() => setRoomSelectionOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {property.rooms.map((room) => {
                const roomImage = room.images[0]?.url || property.mainImage;
                
                return (
                  <div key={room.id} className="border-2 rounded-2xl hover:border-primary transition-all overflow-hidden bg-card">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="w-full md:w-1/3">
                        <img 
                          src={roomImage}
                          alt={room.name}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-display font-bold mb-2">
                            {room.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {room.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{room.maxGuests} Guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            <span>{room.bedConfiguration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="w-4 h-4" />
                            <span>{room.size} m²</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">FROM</p>
                            <p className="text-2xl font-display font-bold">
                              ₱{room.basePrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          <Button 
                            className="rounded-full"
                            asChild
                          >
                            <Link href={`/booking?propertySlug=${property.slug}&roomSlug=${room.slug}`}>
                              Book Now
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-neutral-300 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white hover:text-neutral-300 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 text-white hover:text-neutral-300 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <img 
            src={allImages[currentImageIndex]}
            alt={`${property.name} - Image ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-body text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
