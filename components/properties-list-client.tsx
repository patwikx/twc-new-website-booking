'use client';

import { useState, useMemo } from 'react';
import { MapPin, Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { PropertyData } from '@/actions/properties/get-properties';

interface PropertiesListClientProps {
  properties: PropertyData[];
}

export default function PropertiesListClient({ properties }: PropertiesListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique locations
  const locations = useMemo(() => {
    const locs = Array.from(new Set(properties.map(p => p.location)));
    return locs;
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(p => {
        const minPrice = p.rooms[0]?.basePrice || 0;
        switch (priceRange) {
          case 'budget':
            return minPrice < 3000;
          case 'mid':
            return minPrice >= 3000 && minPrice < 5000;
          case 'luxury':
            return minPrice >= 5000;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.rooms[0]?.basePrice || 0) - (b.rooms[0]?.basePrice || 0);
        case 'price-high':
          return (b.rooms[0]?.basePrice || 0) - (a.rooms[0]?.basePrice || 0);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, searchQuery, selectedLocation, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setPriceRange('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchQuery || selectedLocation !== 'all' || priceRange !== 'all' || sortBy !== 'name';

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
              Discover
            </p>
            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
              Our Properties
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our collection of distinctive hotels and resorts across the Philippines
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden rounded-full"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="all">All Prices</option>
                <option value="budget">Under ₱3,000</option>
                <option value="mid">₱3,000 - ₱5,000</option>
                <option value="luxury">Above ₱5,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="location">Location</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 space-y-3 pb-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="all">All Prices</option>
                <option value="budget">Under ₱3,000</option>
                <option value="mid">₱3,000 - ₱5,000</option>
                <option value="luxury">Above ₱5,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-12 py-2 rounded-full border bg-background text-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="location">Location</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No properties found</p>
              <Button variant="outline" onClick={clearFilters} className="rounded-full">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredProperties.map((property, index) => {
                const minPrice = Math.min(...property.rooms.map(r => r.basePrice));
                
                return (
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
                            <span className="font-semibold">From ₱{minPrice.toLocaleString()}</span>
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
