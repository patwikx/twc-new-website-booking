'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Users, Check, AlertCircle } from 'lucide-react';
import { checkRoomAvailability, type AvailabilityData } from '@/actions/rooms/check-room-availability';
import { format, addMonths, isSameDay } from 'date-fns';

interface AvailabilityCheckerProps {
  roomId: string;
  roomName: string;
  basePrice: number;
  maxGuests: number;
  totalRooms: number;
  onClose: () => void;
}

export default function AvailabilityChecker({
  roomId,
  roomName,
  basePrice,
  maxGuests,
  totalRooms,
  onClose,
}: AvailabilityCheckerProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  // Auto-calculate rooms based on guests
  const rooms = Math.ceil(guests / maxGuests);

  // Fetch availability when dates change
  useEffect(() => {
    if (checkInDate) {
      const endDate = checkOutDate || addMonths(checkInDate, 2);
      fetchAvailability(checkInDate, endDate);
    }
  }, [checkInDate, checkOutDate, roomId]);

  const fetchAvailability = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const data = await checkRoomAvailability(roomId, start, end);
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!checkInDate || selectingCheckOut) {
      if (!checkInDate) {
        setCheckInDate(date);
        setSelectingCheckOut(true);
      } else {
        if (date > checkInDate) {
          setCheckOutDate(date);
          setSelectingCheckOut(false);
        } else {
          // If selected date is before check-in, reset
          setCheckInDate(date);
          setCheckOutDate(undefined);
          setSelectingCheckOut(true);
        }
      }
    } else {
      // Reset selection
      setCheckInDate(date);
      setCheckOutDate(undefined);
      setSelectingCheckOut(true);
    }
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const avail = availability.find((a) => a.date === dateStr);
    return avail ? avail.availableRooms >= rooms : true;
  };

  const getDateAvailability = (date: Date): AvailabilityData | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability.find((a) => a.date === dateStr);
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return basePrice * nights * rooms;
  };

  const nights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const canProceed = checkInDate && checkOutDate && guests > 0 && rooms > 0 && nights > 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-display font-bold mb-1">Check Availability</h2>
            <p className="font-body text-sm text-neutral-300">{roomName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-neutral-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Calendar */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-4">
                  Select Your Dates
                </h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      CHECK-IN
                    </label>
                    <div className="border-2 border-neutral-300 p-3 font-body text-sm">
                      {checkInDate ? format(checkInDate, 'MMM dd, yyyy') : 'Select date'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="font-body text-xs tracking-wider text-neutral-500 mb-2 block">
                      CHECK-OUT
                    </label>
                    <div className="border-2 border-neutral-300 p-3 font-body text-sm">
                      {checkOutDate ? format(checkOutDate, 'MMM dd, yyyy') : 'Select date'}
                    </div>
                  </div>
                </div>
              </div>

              <Calendar
                mode="single"
                selected={selectingCheckOut ? checkOutDate : checkInDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || !isDateAvailable(date)}
                className="border-2 border-neutral-200"
                modifiers={{
                  booked: (date) => !isDateAvailable(date),
                  checkIn: (date) => checkInDate ? isSameDay(date, checkInDate) : false,
                  checkOut: (date) => checkOutDate ? isSameDay(date, checkOutDate) : false,
                }}
                modifiersStyles={{
                  booked: {
                    textDecoration: 'line-through',
                    color: '#999',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0.375rem',
                  },
                  checkIn: {
                    backgroundColor: '#171717',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '0.375rem',
                  },
                  checkOut: {
                    backgroundColor: '#171717',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '0.375rem',
                  },
                }}
              />

              {/* Legend */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 font-body text-sm text-neutral-600">
                  <div className="w-4 h-4 bg-neutral-900"></div>
                  <span>Selected dates</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-neutral-600">
                  <div className="w-4 h-4 bg-neutral-200 line-through"></div>
                  <span>Fully booked</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-neutral-600">
                  <div className="w-4 h-4 border-2 border-neutral-300"></div>
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="space-y-6">
                {/* Guests */}
                <div>
                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-4">
                    Number of Guests
                  </h3>
                  
                  <div className="border-2 border-neutral-900 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-neutral-900" />
                        <span className="font-body text-lg font-semibold text-neutral-900">
                          {guests} {guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          disabled={guests <= 1}
                          className="w-10 h-10 border-2 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <button
                          onClick={() => {
                            const maxAllowed = maxGuests * rooms;
                            setGuests(Math.min(maxAllowed, guests + 1));
                          }}
                          disabled={guests >= maxGuests * rooms}
                          className="w-10 h-10 border-2 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="font-body text-sm text-neutral-600">
                      This room accommodates up to {maxGuests} guests
                    </p>
                    {guests > maxGuests && (
                      <div className="mt-3 pt-3 border-t border-neutral-300">
                        <p className="font-body text-sm text-neutral-900 font-semibold">
                          {rooms} {rooms === 1 ? 'room' : 'rooms'} needed for {guests} guests
                        </p>
                        <p className="font-body text-xs text-neutral-600 mt-1">
                          Additional rooms will be automatically added
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Summary */}
                {checkInDate && checkOutDate && (
                  <div className="bg-neutral-50 p-6">
                    <h3 className="text-lg font-display font-bold text-neutral-900 mb-4">
                      Booking Summary
                    </h3>
                    <div className="space-y-3 font-body text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Check-in</span>
                        <span className="font-semibold">{format(checkInDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Check-out</span>
                        <span className="font-semibold">{format(checkOutDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Nights</span>
                        <span className="font-semibold">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Guests</span>
                        <span className="font-semibold">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Rooms Required</span>
                        <span className="font-semibold">{rooms} {rooms === 1 ? 'room' : 'rooms'}</span>
                      </div>
                      <div className="border-t border-neutral-300 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">₱{basePrice.toLocaleString()} × {nights} nights × {rooms} rooms</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₱{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Availability Status */}
                {checkInDate && checkOutDate && (
                  <div className="border-2 border-neutral-900 p-4">
                    {canProceed ? (
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-body font-semibold text-neutral-900">Available</p>
                          <p className="font-body text-sm text-neutral-600">
                            This room is available for your selected dates
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-body font-semibold text-neutral-900">Not Available</p>
                          <p className="font-body text-sm text-neutral-600">
                            Please select different dates or reduce number of rooms
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-neutral-900 hover:bg-black text-white font-body tracking-wider transition-all"
                    disabled={!canProceed}
                  >
                    Proceed to Booking
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-body tracking-wider transition-all"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
