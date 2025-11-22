'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, MapPin, ArrowRight, ArrowLeft, Bed, Maximize2 } from 'lucide-react';
import { checkRoomAvailability, type AvailabilityData } from '@/actions/rooms/check-room-availability';
import { getSuggestedRooms, type SuggestedRoom } from '@/actions/rooms/get-suggested-rooms';
import { format, addMonths } from 'date-fns';
import Link from 'next/link';
import type { RoomDetailData } from '@/actions/rooms/get-room-detail';
import type { BookingSettingsData } from '@/actions/booking/get-booking-settings';

interface BookingClientProps {
  room: RoomDetailData;
  bookingSettings: BookingSettingsData | null;
}

export default function BookingClient({
  room,
  bookingSettings,
}: BookingClientProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [suggestedRooms, setSuggestedRooms] = useState<SuggestedRoom[]>([]);

  // Auto-calculate rooms based on guests
  const rooms = Math.ceil(guests / room.maxGuests);

  // Fetch suggested rooms on mount
  useEffect(() => {
    const fetchSuggested = async () => {
      const rooms = await getSuggestedRooms(room.id, room.property.id, 3);
      setSuggestedRooms(rooms);
    };
    fetchSuggested();
  }, [room.id, room.property.id]);

  // Fetch availability when dates change
  useEffect(() => {
    if (checkInDate) {
      const endDate = checkOutDate || addMonths(checkInDate, 2);
      fetchAvailability(checkInDate, endDate);
    }
  }, [checkInDate, checkOutDate]);

  const fetchAvailability = async (start: Date, end: Date) => {
    try {
      const data = await checkRoomAvailability(room.id, start, end);
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const avail = availability.find((a) => a.date === dateStr);
    return avail ? avail.availableRooms >= rooms : true;
  };

  const nights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!nights || !bookingSettings) {
      return null;
    }

    const subtotal = room.basePrice * nights * rooms;
    
    let serviceCharge = 0;
    if (bookingSettings.serviceChargeEnabled) {
      serviceCharge = subtotal * (bookingSettings.serviceChargeRate / 100);
    }

    const taxableAmount = bookingSettings.taxAppliesTo === 'SUBTOTAL' 
      ? subtotal 
      : subtotal + serviceCharge;
    
    const tax = taxableAmount * (bookingSettings.taxRate / 100);

    let additionalFees = 0;
    if (bookingSettings.cleaningFeeEnabled && bookingSettings.cleaningFeeAmount) {
      additionalFees += bookingSettings.cleaningFeeAmount;
    }
    if (bookingSettings.resortFeeEnabled && bookingSettings.resortFeeAmount) {
      additionalFees += bookingSettings.resortFeePerNight 
        ? bookingSettings.resortFeeAmount * nights 
        : bookingSettings.resortFeeAmount;
    }

    const total = subtotal + serviceCharge + tax + additionalFees;

    return {
      subtotal,
      serviceCharge,
      tax,
      additionalFees,
      total,
    };
  }, [nights, rooms, room.basePrice, bookingSettings]);

  const canProceed = checkInDate && checkOutDate && guests > 0 && nights > 0 && pricing;

  return (
    <div className="min-h-screen bg-neutral-50 pt-30 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-body text-neutral-600">
                <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
                <span>/</span>
                <Link href="/properties" className="hover:text-neutral-900 transition">Properties</Link>
                <span>/</span>
                <Link href={`/properties/${room.property.slug}`} className="hover:text-neutral-900 transition">
                  {room.property.name}
                </Link>
                <span>/</span>
                <Link href={`/properties/${room.property.slug}/rooms/${room.slug}`} className="hover:text-neutral-900 transition">
                  {room.name}
                </Link>
                <span>/</span>
                <span className="text-neutral-900">Book Now</span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2 leading-none">
                Book Your Stay
              </h1>
              <div className="flex items-center gap-3 text-neutral-600">
                <span className="font-body text-base">{room.name}</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-body text-sm">{room.property.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Date Selection */}
            <div className="bg-white p-6 rounded-2xl">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">
                Select Your Dates
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Check-in Date */}
                <div>
                  <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                    CHECK-IN
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-body border-2 border-neutral-300 hover:border-neutral-900 h-14 text-base text-neutral-900 rounded-xl"
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-neutral-600" />
                        {checkInDate ? format(checkInDate, 'MMMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => {
                          setCheckInDate(date);
                          if (date && checkOutDate && date >= checkOutDate) {
                            setCheckOutDate(undefined);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                    CHECK-OUT
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-2 border-neutral-300 hover:border-neutral-900 h-14 text-base rounded-xl"
                        disabled={!checkInDate}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {checkOutDate ? format(checkOutDate, 'MMMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => !checkInDate || date <= checkInDate || !isDateAvailable(date)}
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="bg-white p-6 rounded-2xl">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">
                Number of Guests
              </h2>
              
              <div className="border-2 border-neutral-900 p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-neutral-900" />
                    <span className="font-body text-xl font-semibold text-neutral-900">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="w-12 h-12 border-2 border-neutral-900 rounded-lg flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="w-12 h-12 border-2 border-neutral-900 rounded-lg flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="font-body text-sm text-neutral-600 mt-4">
                  This room accommodates up to {room.maxGuests} guests
                </p>
                {guests > room.maxGuests && (
                  <div className="mt-4 pt-4 border-t border-neutral-300">
                    <p className="font-body text-sm text-neutral-900 font-semibold">
                      {rooms} {rooms === 1 ? 'room' : 'rooms'} required for {guests} guests
                    </p>
                    <p className="font-body text-xs text-neutral-600 mt-1">
                      Additional rooms will be automatically added to your booking
                    </p>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Right Column - Booking Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 text-white p-6 rounded-2xl sticky top-4">
              <h2 className="text-xl font-display font-bold mb-5">Booking Summary</h2>
              
              {checkInDate && checkOutDate && pricing ? (
                <div className="space-y-5">
                  <div className="space-y-2.5 font-body text-sm pb-5 border-b border-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Check-in</span>
                      <span>{format(checkInDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Check-out</span>
                      <span>{format(checkOutDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Nights</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Guests</span>
                      <span className="font-semibold">{guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Rooms</span>
                      <span className="font-semibold">{rooms}</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 font-body text-sm pb-5 border-b border-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">
                        {bookingSettings?.currencySymbol}
                        {room.basePrice.toLocaleString()} × {nights} nights × {rooms} rooms
                      </span>
                      <span>{bookingSettings?.currencySymbol}{pricing.subtotal.toLocaleString()}</span>
                    </div>
                    
                    {bookingSettings?.serviceChargeEnabled && pricing.serviceCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          {bookingSettings.serviceChargeName} ({bookingSettings.serviceChargeRate}%)
                        </span>
                        <span>{bookingSettings.currencySymbol}{pricing.serviceCharge.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-neutral-400">
                        {bookingSettings?.taxName} ({bookingSettings?.taxRate}%)
                      </span>
                      <span>{bookingSettings?.currencySymbol}{pricing.tax.toLocaleString()}</span>
                    </div>

                    {pricing.additionalFees > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Additional Fees</span>
                        <span>{bookingSettings?.currencySymbol}{pricing.additionalFees.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-lg font-display font-bold">
                    <span>Total</span>
                    <span>{bookingSettings?.currencySymbol}{pricing.total.toLocaleString()}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-body tracking-wider transition-all mt-5 rounded-full"
                    disabled={!canProceed}
                    asChild
                  >
                    <Link 
                      href={{
                        pathname: '/booking/guest-details',
                        query: {
                          roomId: room.id,
                          checkIn: checkInDate?.toISOString(),
                          checkOut: checkOutDate?.toISOString(),
                          guests: guests.toString(),
                          rooms: rooms.toString(),
                        }
                      }}
                    >
                      Continue to Guest Details
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="font-body text-sm text-neutral-400">
                    Select your dates and number of guests to see pricing
                  </p>
                </div>
              )}

              <Link
                href={`/properties/${room.property.slug}/rooms/${room.slug}`}
                className="flex items-center justify-center gap-2 mt-5 font-body text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Room Details
              </Link>
            </div>
          </div>
        </div>

        {/* Suggested Rooms - Full Width */}
        {suggestedRooms.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl overflow-hidden">
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
