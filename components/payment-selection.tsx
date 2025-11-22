'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Building2, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { createPayMongoCheckout } from '@/actions/payment/create-paymongo-checkout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentSelectionProps {
  bookingData: {
    id: string;
    bookingNumber: string;
    roomName: string;
    roomSlug: string;
    propertyName: string;
    propertySlug: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    rooms: number;
    totalAmount: number;
    amountDue: number;
    currencySymbol: string;
    guestName: string;
    guestEmail: string;
  };
  cancelledStatus?: boolean;
}

export default function PaymentSelection({ bookingData, cancelledStatus }: PaymentSelectionProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'hotel' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downpaymentAmount = bookingData.totalAmount * 0.3; // 30% downpayment
  const remainingAmount = bookingData.totalAmount - downpaymentAmount;

  const handlePayOnline = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createPayMongoCheckout({
        bookingId: bookingData.id,
        amount: bookingData.totalAmount,
        description: `Full payment for ${bookingData.roomName} at ${bookingData.propertyName}`,
      });

      if (result.success && result.checkoutUrl) {
        // Redirect to PayMongo checkout (same tab)
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const handlePayAtHotel = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createPayMongoCheckout({
        bookingId: bookingData.id,
        amount: downpaymentAmount,
        description: `30% downpayment for ${bookingData.roomName} at ${bookingData.propertyName}`,
      });

      if (result.success && result.checkoutUrl) {
        // Redirect to PayMongo checkout (same tab)
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

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
            <span className="text-neutral-900">Payment</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2">
            Select Payment Method
          </h1>
          <p className="font-body text-neutral-600">
            Booking #{bookingData.bookingNumber}
          </p>
        </div>

        {cancelledStatus && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-body font-semibold text-yellow-900">Payment Cancelled</p>
              <p className="font-body text-sm text-yellow-800">
                Your previous payment was cancelled. Please select a payment method to complete your booking.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl text-red-800 p-4 mb-6 font-body text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pay Online - Full Payment */}
          <button
            onClick={() => setSelectedMethod('online')}
            className={`bg-white p-6 border-2 rounded-2xl transition-all text-left ${
              selectedMethod === 'online'
                ? 'border-neutral-900 shadow-lg'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-900">Pay Online</h3>
                  <p className="text-sm font-body text-neutral-600">Full Payment</p>
                </div>
              </div>
              {selectedMethod === 'online' && (
                <CheckCircle className="w-6 h-6 text-neutral-900" />
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Pay the full amount now</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Secure payment via PayMongo</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Credit/Debit Card, GCash, PayMaya, GrabPay</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <p className="text-xs font-body text-neutral-500 mb-1">Total Amount</p>
              <p className="text-2xl font-display font-bold text-neutral-900">
                {bookingData.currencySymbol}{bookingData.totalAmount.toLocaleString()}
              </p>
            </div>
          </button>

          {/* Pay at Hotel - Downpayment */}
          <button
            onClick={() => setSelectedMethod('hotel')}
            className={`bg-white p-6 border-2 rounded-2xl transition-all text-left ${
              selectedMethod === 'hotel'
                ? 'border-neutral-900 shadow-lg'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-900">Pay at Hotel</h3>
                  <p className="text-sm font-body text-neutral-600">30% Downpayment Required</p>
                </div>
              </div>
              {selectedMethod === 'hotel' && (
                <CheckCircle className="w-6 h-6 text-neutral-900" />
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Pay 30% downpayment now</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Pay remaining balance at check-in</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-neutral-700">
                <div className="w-1.5 h-1.5 bg-neutral-900"></div>
                <span>Cash or card accepted at hotel</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-neutral-600">Downpayment (30%)</span>
                <span className="font-semibold text-neutral-900">
                  {bookingData.currencySymbol}{downpaymentAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-neutral-600">Pay at hotel</span>
                <span className="font-semibold text-neutral-900">
                  {bookingData.currencySymbol}{remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">Booking Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6 font-body text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Guest</span>
                <span className="font-semibold">{bookingData.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Room</span>
                <span className="font-semibold">{bookingData.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Property</span>
                <span className="font-semibold">{bookingData.propertyName}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Check-in</span>
                <span className="font-semibold">{bookingData.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Check-out</span>
                <span className="font-semibold">{bookingData.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Nights</span>
                <span className="font-semibold">{bookingData.nights}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-neutral-900 hover:bg-black text-white font-body tracking-wider transition-all rounded-full px-12 disabled:opacity-50"
            disabled={!selectedMethod || isProcessing}
            onClick={selectedMethod === 'online' ? handlePayOnline : handlePayAtHotel}
          >
            {isProcessing ? 'Redirecting to Payment...' : 'Proceed to Payment'}
            {!isProcessing && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
