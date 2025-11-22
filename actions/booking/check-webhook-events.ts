'use server';

import { prisma } from '@/lib/prisma';

export async function checkWebhookEvents(bookingId: string) {
  try {
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      return { error: 'Booking not found' };
    }

    // Get webhook events related to this booking's payments
    const paymentIntentIds = booking.payments
      .map(p => p.paymongoPaymentIntentId)
      .filter(Boolean);

    const webhookEvents = await prisma.payMongoWebhookEvent.findMany({
      where: {
        paymentIntentId: {
          in: paymentIntentIds as string[],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amountPaid: Number(booking.amountPaid),
        amountDue: Number(booking.amountDue),
        totalAmount: Number(booking.totalAmount),
      },
      payments: booking.payments.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status,
        paymentMethod: p.paymentMethod,
        paymongoPaymentIntentId: p.paymongoPaymentIntentId,
        description: p.description,
        createdAt: p.createdAt,
        paidAt: p.paidAt,
      })),
      webhookEvents: webhookEvents.map(w => ({
        id: w.id,
        eventId: w.eventId,
        eventType: w.eventType,
        processed: w.processed,
        processingError: w.processingError,
        createdAt: w.createdAt,
        processedAt: w.processedAt,
      })),
    };
  } catch (error) {
    console.error('Error checking webhook events:', error);
    return { error: 'Failed to check webhook events' };
  }
}
