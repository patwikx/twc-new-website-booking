'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Users, Maximize2, Bed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/actions/booking/create-booking';
import { getSuggestedRooms, type SuggestedRoom } from '@/actions/rooms/get-suggested-rooms';
import CouponInput from '@/components/coupon-input';
import AddOnsSelector from '@/components/add-ons-selector';

interface AppliedPromotion {
  id: string;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface AvailableFee {
  id: string;
  name: string;
  description: string | null;
  feeType: string;
  amount: number;
  isPercentage: boolean;
  isPerNight: boolean;
  isPerGuest: boolean;
  isOptional: boolean;
}

interface SelectedFee {
  id: string;
  name: string;
  amount: number;
}

interface GuestDetailsFormProps {
  bookingData: {
    roomId: string;
    roomName: string;
    propertyName: string;
    propertySlug: string;
    propertyId: string;
    roomSlug: string;
    checkIn: string;
    checkOut: string;
    checkInISO: string;
    checkOutISO: string;
    nights: number;
    guests: number;
    rooms: number;
    basePrice: number;
    subtotal: number;
    serviceCharge: number;
    serviceChargeName: string;
    serviceChargeRate: number;
    serviceChargeEnabled: boolean;
    tax: number;
    taxName: string;
    taxRate: number;
    additionalFees: number;
    total: number;
    currencySymbol: string;
  };
  availableFees: AvailableFee[];
}

export default function GuestDetailsForm({ bookingData, availableFees }: GuestDetailsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedRooms, setSuggestedRooms] = useState<SuggestedRoom[]>([]);
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);
  const [selectedFees, setSelectedFees] = useState<SelectedFee[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    specialRequests: '',
  });

  // Calculate final total with discount and add-ons
  const discountAmount = appliedPromotion?.discountAmount || 0;
  const addOnsTotal = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
  const finalTotal = bookingData.total + addOnsTotal - discountAmount;

  // Fetch suggested rooms on mount
  useEffect(() => {
    const fetchSuggested = async () => {
      const rooms = await getSuggestedRooms(bookingData.roomId, bookingData.propertySlug, 3);
      setSuggestedRooms(rooms);
    };
    fetchSuggested();
  }, [bookingData.roomId, bookingData.propertySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createBooking({
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInISO,
        checkOutDate: bookingData.checkOutISO,
        numberOfGuests: bookingData.guests,
        numberOfRooms: bookingData.rooms,
        totalAmount: finalTotal,
        discountAmount: discountAmount,
        promotionCode: appliedPromotion?.code,
        selectedFees: selectedFees,
        guestDetails: formData,
      });

      if (result.success && result.bookingId) {
        // Redirect to payment selection page
        router.push(`/booking/payment?bookingId=${result.bookingId}`);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-body text-neutral-600">
            <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-neutral-900 transition">Properties</Link>
            <span>/</span>
            <Link href={`/properties/${bookingData.propertySlug}`} className="hover:text-neutral-900 transition">
              {bookingData.propertyName}
            </Link>
            <span>/</span>
            <Link href={`/properties/${bookingData.propertySlug}/rooms/${bookingData.roomSlug}`} className="hover:text-neutral-900 transition">
              {bookingData.roomName}
            </Link>
            <span>/</span>
            <Link href={`/booking?propertySlug=${bookingData.propertySlug}&roomSlug=${bookingData.roomSlug}`} className="hover:text-neutral-900 transition">
              Booking
            </Link>
            <span>/</span>
            <span className="text-neutral-900">Guest Details</span>
          </div>
        </div>

        {/* Headers and Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2 leading-none">
                Guest Details
              </h1>
              <p className="font-body text-neutral-600">
                Please provide your information to complete the booking
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 mb-6 rounded-xl font-body text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl space-y-5">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-3">
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      FIRST NAME <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      LAST NAME <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      EMAIL ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      PHONE NUMBER <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-3">
                  Address Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      STREET ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                        CITY <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                        placeholder="Manila"
                      />
                    </div>
                    
                    <div>
                      <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                        COUNTRY <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors"
                        placeholder="Philippines"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-3">
                  Special Requests
                </h2>
                
                <div>
                  <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                    ADDITIONAL NOTES (OPTIONAL)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full border-2 border-neutral-300 rounded-xl p-2.5 font-body text-sm focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-body tracking-wider transition-all rounded-full"
                  disabled={isSubmitting}
                  asChild
                >
                  <Link href={`/booking?propertySlug=${bookingData.propertySlug}&roomSlug=${bookingData.roomSlug}`}>
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back to Booking
                  </Link>
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-black text-white font-body tracking-wider transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Booking...' : 'Continue to Payment'}
                  {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2 leading-none">
                Booking Summary
              </h2>
              <p className="font-body text-neutral-600">
                Review your booking details
              </p>
            </div>
            
            <div className="bg-neutral-900 text-white p-5 rounded-2xl">
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-body text-sm pb-3.5 border-b border-neutral-700">
                  <span className="text-neutral-400">Room</span>
                  <span className="text-right">{bookingData.roomName}</span>
                  
                  <span className="text-neutral-400">Property</span>
                  <span className="text-right">{bookingData.propertyName}</span>
                  
                  <span className="text-neutral-400">Check-in</span>
                  <span className="text-right">{bookingData.checkIn}</span>
                  
                  <span className="text-neutral-400">Check-out</span>
                  <span className="text-right">{bookingData.checkOut}</span>
                  
                  <span className="text-neutral-400">Nights</span>
                  <span className="text-right font-semibold">{bookingData.nights}</span>
                  
                  <span className="text-neutral-400">Guests</span>
                  <span className="text-right font-semibold">{bookingData.guests}</span>
                  
                  <span className="text-neutral-400">Rooms</span>
                  <span className="text-right font-semibold">{bookingData.rooms}</span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 font-body text-sm pb-3.5 border-b border-neutral-700">
                  {/* Room Charges */}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">
                      {bookingData.currencySymbol}{bookingData.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {bookingData.nights} nights × {bookingData.rooms} rooms
                    </span>
                    <span>{bookingData.currencySymbol}{bookingData.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Selected Add-ons Display - Right after room charges */}
                  {selectedFees.length > 0 && selectedFees.map((fee) => (
                    <div key={fee.id} className="flex justify-between">
                      <span className="text-neutral-400">{fee.name}</span>
                      <span>
                        {bookingData.currencySymbol}
                        {fee.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add-ons Selector */}
                {availableFees.length > 0 && (
                  <div className="pb-3.5 border-b border-neutral-700">
                    <AddOnsSelector
                      availableFees={availableFees}
                      numberOfNights={bookingData.nights}
                      numberOfGuests={bookingData.guests}
                      subtotal={bookingData.subtotal}
                      currencySymbol={bookingData.currencySymbol}
                      onFeesChange={setSelectedFees}
                    />
                  </div>
                )}

                {/* Coupon Section */}
                <div className="pb-3.5 border-b border-neutral-700">
                  <h3 className="text-sm font-body font-semibold mb-2">Have a promo code?</h3>
                  <CouponInput
                    propertyId={bookingData.propertyId}
                    roomId={bookingData.roomId}
                    checkInDate={bookingData.checkInISO}
                    checkOutDate={bookingData.checkOutISO}
                    subtotal={bookingData.subtotal}
                    numberOfNights={bookingData.nights}
                    currencySymbol={bookingData.currencySymbol}
                    onApply={setAppliedPromotion}
                    onRemove={() => setAppliedPromotion(null)}
                    appliedPromotion={appliedPromotion}
                  />
                </div>

                {/* Discount Display */}
                {appliedPromotion && (
                  <div className="space-y-2 font-body text-sm pb-3.5 border-b border-neutral-700">
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({appliedPromotion.code})</span>
                      <span>-{bookingData.currencySymbol}{discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}

                {/* Service Charge and Tax */}
                <div className="space-y-2 font-body text-sm pb-3.5 border-b border-neutral-700">
                  {bookingData.serviceChargeEnabled && bookingData.serviceCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">
                        {bookingData.serviceChargeName} ({bookingData.serviceChargeRate}%)
                      </span>
                      <span>{bookingData.currencySymbol}{bookingData.serviceCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-400">
                      {bookingData.taxName} ({bookingData.taxRate}%)
                    </span>
                    <span>{bookingData.currencySymbol}{bookingData.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {bookingData.additionalFees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Additional Fees</span>
                      <span>{bookingData.currencySymbol}{bookingData.additionalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-2xl font-display font-bold">
                  <span>Total</span>
                  <span>{bookingData.currencySymbol}{finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Suggested Rooms */}
        {suggestedRooms.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">
              Other Rooms You Might Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedRooms.map((suggestedRoom) => (
                <Link
                  key={suggestedRoom.id}
                  href={`/properties/${suggestedRoom.propertySlug}/rooms/${suggestedRoom.slug}`}
                  className="border-2 border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-900 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={suggestedRoom.mainImage}
                      alt={suggestedRoom.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center absolute inset-0">
                      <Bed className="w-16 h-16 text-neutral-400" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-neutral-900 mb-1 text-lg">
                      {suggestedRoom.name}
                    </h3>
                    <p className="text-xs text-neutral-500 tracking-wider uppercase mb-3">
                      {suggestedRoom.type}
                    </p>
                    
                    <div className="flex gap-3 text-xs text-neutral-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{suggestedRoom.maxGuests} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>{suggestedRoom.size} m²</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-neutral-500 mb-3">
                      {suggestedRoom.totalRooms} {suggestedRoom.totalRooms === 1 ? 'room' : 'rooms'} available
                    </div>
                    
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-lg font-display font-bold text-neutral-900">
                        ₱{suggestedRoom.basePrice.toLocaleString()}
                        <span className="text-xs text-neutral-500 font-body font-normal ml-1">per night</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
