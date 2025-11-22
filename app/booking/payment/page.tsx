import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PaymentSelection from '@/components/payment-selection';
import { format } from 'date-fns';

interface PaymentPageProps {
  searchParams: Promise<{
    bookingId?: string;
    status?: string;
  }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;
  const { bookingId, status } = params;

  if (!bookingId) {
    redirect('/');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!booking) {
    redirect('/');
  }

  const bookingSettings = await prisma.bookingSettings.findFirst();

  const bookingData = {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    roomName: booking.room.name,
    roomSlug: booking.room.slug,
    propertyName: booking.room.property.name,
    propertySlug: booking.room.property.slug,
    checkIn: format(booking.checkInDate, 'MMM dd, yyyy'),
    checkOut: format(booking.checkOutDate, 'MMM dd, yyyy'),
    nights: booking.numberOfNights,
    guests: booking.numberOfGuests,
    rooms: booking.numberOfRooms,
    totalAmount: Number(booking.totalAmount),
    amountDue: Number(booking.amountDue),
    currencySymbol: bookingSettings?.currencySymbol || '₱',
    guestName: `${booking.guestFirstName} ${booking.guestLastName}`,
    guestEmail: booking.guestEmail,
  };

  return <PaymentSelection bookingData={bookingData} cancelledStatus={status === 'cancelled'} />;
}
