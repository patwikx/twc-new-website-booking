'use server';

import { prisma } from '@/lib/prisma';

interface ValidatePromoCodeParams {
  code: string;
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  subtotal: number;
  numberOfNights: number;
}

interface ValidatePromoCodeResult {
  success: boolean;
  error?: string;
  promotion?: {
    id: string;
    code: string;
    name: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  };
}

export async function validatePromoCode(
  params: ValidatePromoCodeParams
): Promise<ValidatePromoCodeResult> {
  try {
    const { code, propertyId, roomId, checkInDate, checkOutDate, subtotal, numberOfNights } = params;

    // Find the promotion
    const promotion = await prisma.promotion.findUnique({
      where: { 
        code: code.toUpperCase(),
        isActive: true,
      },
    });

    if (!promotion) {
      return {
        success: false,
        error: 'Invalid promo code',
      };
    }

    // Check if promotion is currently valid (date range)
    const now = new Date();
    if (now < promotion.validFrom || now > promotion.validTo) {
      return {
        success: false,
        error: 'This promo code has expired or is not yet valid',
      };
    }

    // Check if max uses reached
    if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
      return {
        success: false,
        error: 'This promo code has reached its usage limit',
      };
    }

    // Check property applicability
    if (!promotion.applyToAllProperties) {
      if (!promotion.propertyIds.includes(propertyId)) {
        return {
          success: false,
          error: 'This promo code is not valid for this property',
        };
      }
    }

    // Check room type applicability
    if (!promotion.applyToAllRoomTypes) {
      if (!promotion.roomTypeIds.includes(roomId)) {
        return {
          success: false,
          error: 'This promo code is not valid for this room type',
        };
      }
    }

    // Check minimum stay requirement
    if (promotion.minStay && numberOfNights < promotion.minStay) {
      return {
        success: false,
        error: `This promo code requires a minimum stay of ${promotion.minStay} nights`,
      };
    }

    // Check minimum booking amount
    if (promotion.minBookingAmount && subtotal < Number(promotion.minBookingAmount)) {
      return {
        success: false,
        error: `This promo code requires a minimum booking amount of ₱${Number(promotion.minBookingAmount).toLocaleString()}`,
      };
    }

    // Check maximum booking amount
    if (promotion.maxBookingAmount && subtotal > Number(promotion.maxBookingAmount)) {
      return {
        success: false,
        error: `This promo code is only valid for bookings up to ₱${Number(promotion.maxBookingAmount).toLocaleString()}`,
      };
    }

    // Check blackout dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    for (const blackoutDate of promotion.blackoutDates) {
      const blackout = new Date(blackoutDate);
      if (checkIn <= blackout && checkOut >= blackout) {
        return {
          success: false,
          error: 'This promo code cannot be used for the selected dates',
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    
    switch (promotion.discountType) {
      case 'PERCENTAGE':
        discountAmount = subtotal * (Number(promotion.discountValue) / 100);
        // Apply max discount cap if set
        if (promotion.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, Number(promotion.maxDiscountAmount));
        }
        break;
        
      case 'FIXED_AMOUNT':
        discountAmount = Number(promotion.discountValue);
        // Don't allow discount to exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);
        break;
        
      case 'FREE_NIGHT':
        // Calculate one night's value
        const nightValue = subtotal / numberOfNights;
        discountAmount = nightValue * Number(promotion.discountValue);
        break;
        
      default:
        return {
          success: false,
          error: 'Invalid promotion type',
        };
    }

    return {
      success: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        discountType: promotion.discountType,
        discountValue: Number(promotion.discountValue),
        discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
      },
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return {
      success: false,
      error: 'Failed to validate promo code',
    };
  }
}
