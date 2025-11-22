'use client';

import { useState } from 'react';
import { MapPin, Users, Bed, Maximize2, ArrowRight, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { RoomDetailData } from '@/actions/rooms/get-room-detail';
import type { SiteSettingsData } from '@/actions/site/get-site-settings';

interface RoomDetailClientProps {
  room: RoomDetailData;
  siteSettings: SiteSettingsData | null;
}

export default function RoomDetailClient({
  room,
  siteSettings,
}: RoomDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = room.images.length > 0 
    ? room.images.map(img => img.url) 
    : [room.property.mainImage];

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
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-transparent to-neutral-900/60 z-10" />
          <img 
            src={allImages[0]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex items-end justify-start px-6 lg:px-12 pb-12 z-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 mb-4 rounded-full">
                <span className="font-body text-xs tracking-wider text-neutral-700">{room.type}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-white mb-3 leading-none">
                {room.name}
              </h1>
              <Link 
                href={`/properties/${room.property.slug}`}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="font-body text-sm tracking-wider">{room.property.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-sm font-body text-neutral-600">
            <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-neutral-900 transition">Properties</Link>
            <span>/</span>
            <Link href={`/properties/${room.property.slug}`} className="hover:text-neutral-900 transition">
              {room.property.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-900">{room.name}</span>
          </div>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Details */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-8 leading-tight">
                Room Details
              </h2>
              <div className="w-20 h-1 bg-neutral-900 mb-6"></div>
              
              <p className="text-lg font-body text-neutral-700 leading-relaxed mb-8">
                {room.description}
              </p>

              {/* Room Specs */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border-2 border-neutral-900 p-6 rounded-xl">
                  <Users className="w-6 h-6 text-neutral-900 mb-3" />
                  <p className="font-body text-xs tracking-wider text-neutral-500 mb-2">MAX GUESTS</p>
                  <p className="text-2xl font-display font-bold text-neutral-900">{room.maxGuests}</p>
                </div>
                <div className="border-2 border-neutral-900 p-6 rounded-xl">
                  <Bed className="w-6 h-6 text-neutral-900 mb-3" />
                  <p className="font-body text-xs tracking-wider text-neutral-500 mb-2">BED TYPE</p>
                  <p className="text-lg font-display font-bold text-neutral-900">{room.bedConfiguration}</p>
                </div>
                <div className="border-2 border-neutral-900 p-6 rounded-xl">
                  <Maximize2 className="w-6 h-6 text-neutral-900 mb-3" />
                  <p className="font-body text-xs tracking-wider text-neutral-500 mb-2">ROOM SIZE</p>
                  <p className="text-2xl font-display font-bold text-neutral-900">{room.size} m²</p>
                </div>
                <div className="border-2 border-neutral-900 p-6 rounded-xl">
                  <div className="w-6 h-6 flex items-center justify-center mb-3">
                    <div className="w-3 h-3 bg-neutral-900"></div>
                  </div>
                  <p className="font-body text-xs tracking-wider text-neutral-500 mb-2">AVAILABLE</p>
                  <p className="text-2xl font-display font-bold text-neutral-900">{room.totalRooms}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-6">Room Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3 font-body text-neutral-700">
                      <Check className="w-5 h-5 text-neutral-900 flex-shrink-0" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="space-y-6">
              <div className="bg-neutral-900 text-white p-8 rounded-2xl sticky top-32">
                <div className="mb-8">
                  <p className="font-body text-xs tracking-wider text-neutral-400 mb-2">STARTING FROM</p>
                  <p className="text-5xl font-display font-bold mb-2">
                    ₱{room.basePrice.toLocaleString()}
                  </p>
                  <p className="font-body text-sm text-neutral-400">per night</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-neutral-700">
                    <span className="font-body text-sm text-neutral-400">Property</span>
                    <span className="font-body text-sm text-white font-semibold">{room.property.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-700">
                    <span className="font-body text-sm text-neutral-400">Location</span>
                    <span className="font-body text-sm text-white font-semibold">{room.property.location}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-700">
                    <span className="font-body text-sm text-neutral-400">Room Type</span>
                    <span className="font-body text-sm text-white font-semibold">{room.type}</span>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-body tracking-wider transition-all mb-4 rounded-full"
                  asChild
                >
                  <Link href={`/booking?propertySlug=${room.property.slug}&roomSlug=${room.slug}`}>
                    Book This Room
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full bg-white border-2 border-white !text-neutral-900 hover:bg-neutral-100 font-body tracking-wider transition-all rounded-full"
                  asChild
                >
                  <Link href={`/properties/${room.property.slug}`}>
                    View Property
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {allImages.length > 1 && (
        <section className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <p className="font-body text-sm tracking-widest text-neutral-500 mb-4">GALLERY</p>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900">
                Room Photos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative overflow-hidden group aspect-[4/3] shadow-lg hover:shadow-2xl transition-all rounded-2xl"
                >
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-all z-10" />
                  <img 
                    src={image}
                    alt={`${room.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Policies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-12 text-center">
              Room Policies
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-white">2PM</span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">Check-in</h3>
                <p className="font-body text-neutral-600 text-sm">
                  Check-in starts at 2:00 PM
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-white">12PM</span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">Check-out</h3>
                <p className="font-body text-neutral-600 text-sm">
                  Check-out by 12:00 PM
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-white">48h</span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">Cancellation</h3>
                <p className="font-body text-neutral-600 text-sm">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
            Ready to Book<br />Your Stay?
          </h2>
          <p className="text-xl font-body text-neutral-300 mb-8">
            Reserve this room now and enjoy an unforgettable experience
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              className="bg-white hover:bg-neutral-100 text-neutral-900 px-10 py-6 font-body tracking-wider transition-all rounded-full"
            >
              Book Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
             className="bg-white hover:bg-neutral-100 text-neutral-900 px-10 py-6 font-body tracking-wider transition-all rounded-full"
              asChild
            >
              <Link href={`/properties/${room.property.slug}`}>
                View Property
              </Link>
            </Button>
          </div>
        </div>
      </section>

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

          {allImages.length > 1 && (
            <>
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
            </>
          )}

          <img 
            src={allImages[currentImageIndex]}
            alt={`${room.name} - Image ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-body text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
