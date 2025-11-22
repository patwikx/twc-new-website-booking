import { redirect } from 'next/navigation';
import GuestDetailsForm from '@/components/guest-details-form';
import { getRoomById } from '@/actions/rooms/get-room-by-id';
import { getBookingSettings } from '@/actions/booking/get-booking-settings';
import { format } from 'date-fns';

interface GuestDetailsPageProps {
  searchParams: Promise<{
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    rooms?: string;
  }>;
}

export default async function GuestDetailsPage({ searchParams }: GuestDetailsPageProps) {
  const params = await searchParams;
  const { roomId, checkIn, checkOut, guests, rooms } = params;

  // Validate required parameters
  if (!roomId || !checkIn || !checkOut || !guests || !rooms) {
    redirect('/');
  }

  const [room, bookingSettings] = await Promise.all([
    getRoomById(roomId),
    getBookingSettings(),
  ]);

  if (!room || !bookingSettings) {
    redirect('/');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const guestsCount = parseInt(guests);
  const roomsCount = parseInt(rooms);

  // Calculate pricing
  const subtotal = room.basePrice * nights * roomsCount;
  
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

  const bookingData = {
    roomId: room.id,
    roomName: room.name,
    propertyId: room.property.id,
    propertyName: room.property.name,
    propertySlug: room.property.slug,
    roomSlug: room.slug,
    checkIn: format(checkInDate, 'MMM dd, yyyy'),
    checkOut: format(checkOutDate, 'MMM dd, yyyy'),
    checkInISO: checkIn,
    checkOutISO: checkOut,
    nights,
    guests: guestsCount,
    rooms: roomsCount,
    basePrice: Number(room.basePrice),
    subtotal: Number(subtotal),
    serviceCharge: Number(serviceCharge),
    serviceChargeName: bookingSettings.serviceChargeName,
    serviceChargeRate: Number(bookingSettings.serviceChargeRate),
    serviceChargeEnabled: bookingSettings.serviceChargeEnabled,
    tax: Number(tax),
    taxName: bookingSettings.taxName,
    taxRate: Number(bookingSettings.taxRate),
    additionalFees: Number(additionalFees),
    total: Number(total),
    currencySymbol: bookingSettings.currencySymbol,
  };

  return <GuestDetailsForm bookingData={bookingData} />;
}
