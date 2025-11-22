import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// THIS IS FOR TESTING ONLY - REMOVE IN PRODUCTION
export async function POST(req: NextRequest) {
  try {
    const { bookingId, paymentId } = await req.json();

    if (!bookingId || !paymentId) {
      return NextResponse.json(
        { error: 'Booking ID and Payment ID are required' },
        { status: 400 }
      );
    }

    // Get payment and booking
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Update booking
    const amountPaid = Number(payment.booking.amountPaid) + Number(payment.amount);
    const amountDue = Number(payment.booking.totalAmount) - amountPaid;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        amountPaid: amountPaid,
        amountDue: amountDue,
        paymentStatus: amountDue <= 0 ? 'PAID' : 'PARTIAL',
        status: amountDue <= 0 ? 'CONFIRMED' : 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment manually confirmed',
      amountPaid,
      amountDue,
    });
  } catch (error) {
    console.error('Error manually confirming payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
