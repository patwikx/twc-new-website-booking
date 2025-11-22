'use server';

import { prisma } from '@/lib/prisma';

export interface CreateCheckoutInput {
  bookingId: string;
  amount: number;
  description: string;
}

export interface CreateCheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export async function createPayMongoCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        room: true,
        property: true,
      },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    // Create PayMongo checkout session
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: input.description,
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(input.amount * 100), // Convert to cents
                name: `${booking.room.name} - ${booking.property.name}`,
                quantity: 1,
              },
            ],
            payment_method_types: ['card', 'gcash', 'paymaya', 'grab_pay'],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation?bookingId=${booking.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/payment?bookingId=${booking.id}&status=cancelled`,
            metadata: {
              booking_id: booking.id,
              booking_number: booking.bookingNumber,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('PayMongo API error:', error);
      return { success: false, error: 'Failed to create checkout session' };
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.checkout_url;
    const paymentIntentId = data.data.id;

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: input.amount,
        currency: 'PHP',
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'paymongo',
        paymongoPaymentIntentId: paymentIntentId,
        paymongoCheckoutUrl: checkoutUrl,
        paymongoClientKey: data.data.attributes.client_key,
        status: 'PENDING',
        description: input.description,
      },
    });

    return {
      success: true,
      checkoutUrl,
    };
  } catch (error) {
    console.error('Error creating PayMongo checkout:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
