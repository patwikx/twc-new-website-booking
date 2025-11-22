import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Users, Home, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConfirmationPageProps {
  searchParams: Promise<{
    bookingId?: string;
  }>;
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;
  const { bookingId } = params;

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

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-body text-neutral-600">
            <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-neutral-900 transition">Properties</Link>
            <span>/</span>
            <Link href={`/properties/${booking.room.property.slug}`} className="hover:text-neutral-900 transition">
              {booking.room.property.name}
            </Link>
            <span>/</span>
            <Link href={`/properties/${booking.room.property.slug}/rooms/${booking.room.slug}`} className="hover:text-neutral-900 transition">
              {booking.room.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-900">Confirmation</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-lg font-body text-neutral-600 mb-2">
            Thank you for your reservation
          </p>
          <p className="font-body text-sm text-neutral-500">
            Booking Number: <span className="font-semibold text-neutral-900">{booking.bookingNumber}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white p-8 rounded-2xl mb-6">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            Booking Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">PROPERTY</h3>
                <p className="font-body text-lg text-neutral-900">{booking.room.property.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">ROOM</h3>
                <p className="font-body text-lg text-neutral-900">{booking.room.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">CHECK-IN</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-600" />
                    <p className="font-body text-neutral-900">
                      {format(booking.checkInDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">CHECK-OUT</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-600" />
                    <p className="font-body text-neutral-900">
                      {format(booking.checkOutDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">NIGHTS</h3>
                  <p className="font-body text-lg font-semibold text-neutral-900">{booking.numberOfNights}</p>
                </div>
                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">GUESTS</h3>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-600" />
                    <p className="font-body text-lg font-semibold text-neutral-900">{booking.numberOfGuests}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">ROOMS</h3>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-neutral-600" />
                    <p className="font-body text-lg font-semibold text-neutral-900">{booking.numberOfRooms}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">GUEST INFORMATION</h3>
                <div className="space-y-2">
                  <p className="font-body text-lg text-neutral-900">
                    {booking.guestFirstName} {booking.guestLastName}
                  </p>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Mail className="w-4 h-4" />
                    <p className="font-body text-sm">{booking.guestEmail}</p>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Phone className="w-4 h-4" />
                    <p className="font-body text-sm">{booking.guestPhone}</p>
                  </div>
                  {booking.guestAddress && (
                    <div className="flex items-start gap-2 text-neutral-700">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <p className="font-body text-sm">
                        {booking.guestAddress}
                        {booking.guestCity && `, ${booking.guestCity}`}
                        {booking.guestCountry && `, ${booking.guestCountry}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <h3 className="text-sm font-body tracking-wider text-neutral-500 mb-2">SPECIAL REQUESTS</h3>
                  <p className="font-body text-sm text-neutral-700">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-neutral-900 text-white p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-display font-bold mb-6">Payment Summary</h2>
          
          <div className="space-y-3 font-body text-sm pb-5 border-b border-neutral-700">
            <div className="flex justify-between">
              <span className="text-neutral-400">Subtotal</span>
              <span>₱{Number(booking.subtotal).toLocaleString()}</span>
            </div>
            
            {booking.serviceChargeAmount && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Service Charge</span>
                <span>₱{Number(booking.serviceChargeAmount).toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-neutral-400">Tax</span>
              <span>₱{Number(booking.taxAmount).toLocaleString()}</span>
            </div>

            {booking.additionalFeesAmount && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Additional Fees</span>
                <span>₱{Number(booking.additionalFeesAmount).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-2xl font-display font-bold mt-5">
            <span>Total Paid</span>
            <span>₱{Number(booking.totalAmount).toLocaleString()}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-display font-bold text-neutral-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 font-body text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>A confirmation email has been sent to {booking.guestEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Please check your email for detailed booking information and check-in instructions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>If you have any questions, please contact us at the property</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-body tracking-wider transition-all rounded-full"
            asChild
          >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-neutral-900 hover:bg-black text-white font-body tracking-wider transition-all rounded-full"
            asChild
          >
            <Link href={`/properties/${booking.room.property.slug}`}>
              View Property
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
