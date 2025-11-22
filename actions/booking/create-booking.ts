'use server';

import { prisma } from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';

export interface CreateBookingInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalAmount: number;
  discountAmount?: number;
  promotionCode?: string;
  selectedFees?: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    specialRequests?: string;
  };
}

export interface CreateBookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  try {
    // Validate input
    if (!input.roomId || !input.checkInDate || !input.checkOutDate) {
      return {
        success: false,
        error: 'Missing required booking information',
      };
    }

    if (!input.guestDetails.firstName || !input.guestDetails.lastName || !input.guestDetails.email) {
      return {
        success: false,
        error: 'Missing required guest information',
      };
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: input.roomId },
    });

    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    // Calculate required fields
    const checkIn = new Date(input.checkInDate);
    const checkOut = new Date(input.checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate unique booking number
    const bookingNumber = `BK${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Calculate pricing breakdown
    const roomRate = room.basePrice;
    const subtotal = Number(roomRate) * numberOfNights * input.numberOfRooms;
    
    // Get booking settings for tax calculation
    const bookingSettings = await prisma.bookingSettings.findFirst();
    
    let serviceChargeAmount = 0;
    let taxAmount = 0;
    
    if (bookingSettings) {
      if (bookingSettings.serviceChargeEnabled) {
        serviceChargeAmount = subtotal * (Number(bookingSettings.serviceChargeRate) / 100);
      }
      
      const taxableAmount = bookingSettings.taxAppliesTo === 'SUBTOTAL' 
        ? subtotal 
        : subtotal + serviceChargeAmount;
      
      taxAmount = taxableAmount * (Number(bookingSettings.taxRate) / 100);
    }
    
    const amountDue = input.totalAmount;
    const discountAmount = input.discountAmount || 0;
    const promotionCodes = input.promotionCode ? [input.promotionCode] : [];

    // Calculate total add-ons amount
    const addOnsAmount = input.selectedFees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        propertyId: room.propertyId,
        roomId: input.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: input.numberOfGuests,
        numberOfNights,
        numberOfRooms: input.numberOfRooms,
        roomRate,
        subtotal,
        serviceChargeAmount: serviceChargeAmount > 0 ? serviceChargeAmount : null,
        taxAmount,
        additionalFeesAmount: addOnsAmount > 0 ? addOnsAmount : null,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        promotionCodes,
        totalAmount: input.totalAmount,
        amountPaid: 0,
        amountDue,
        status: BookingStatus.PENDING,
        guestFirstName: input.guestDetails.firstName,
        guestLastName: input.guestDetails.lastName,
        guestEmail: input.guestDetails.email,
        guestPhone: input.guestDetails.phone,
        guestAddress: input.guestDetails.address || null,
        guestCity: input.guestDetails.city || null,
        guestCountry: input.guestDetails.country || null,
        specialRequests: input.guestDetails.specialRequests || null,
        fees: {
          create: input.selectedFees?.map((fee) => ({
            name: fee.name,
            amount: fee.amount,
            feeType: 'OTHER',
          })) || [],
        },
      },
    });

    // If promotion was applied, increment usage count
    if (input.promotionCode) {
      await prisma.promotion.updateMany({
        where: { code: input.promotionCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return {
      success: true,
      bookingId: booking.id,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: 'Failed to create booking. Please try again.',
    };
  }
}
