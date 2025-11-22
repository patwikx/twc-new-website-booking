import { notFound, redirect } from 'next/navigation';
import { getRoomDetail } from '@/actions/rooms/get-room-detail';
import { getBookingSettings } from '@/actions/booking/get-booking-settings';
import BookingClient from '@/components/booking-client';

interface BookingPageProps {
  searchParams: Promise<{
    propertySlug?: string;
    roomSlug?: string;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  
  if (!params.propertySlug || !params.roomSlug) {
    redirect('/properties');
  }

  const [room, bookingSettings] = await Promise.all([
    getRoomDetail(params.propertySlug, params.roomSlug),
    getBookingSettings(),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <BookingClient
      room={room}
      bookingSettings={bookingSettings}
    />
  );
}
