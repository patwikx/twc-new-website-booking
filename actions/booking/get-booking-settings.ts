'use server';

import { prisma } from '@/lib/prisma';

export interface BookingSettingsData {
  id: string;
  taxName: string;
  taxRate: number;
  taxAppliesTo: string;
  serviceChargeName: string;
  serviceChargeRate: number;
  serviceChargeEnabled: boolean;
  cleaningFeeName: string | null;
  cleaningFeeAmount: number | null;
  cleaningFeeEnabled: boolean;
  resortFeeName: string | null;
  resortFeeAmount: number | null;
  resortFeePerNight: boolean;
  resortFeeEnabled: boolean;
  cancellationPolicy: string;
  depositRequired: boolean;
  depositPercentage: number | null;
  allowPartialPayment: boolean;
  minPartialPayment: number | null;
  currency: string;
  currencySymbol: string;
}

export async function getBookingSettings(): Promise<BookingSettingsData | null> {
  try {
    const settings = await prisma.bookingSettings.findFirst();
    
    if (!settings) {
      return null;
    }

    return {
      ...settings,
      taxRate: Number(settings.taxRate),
      serviceChargeRate: Number(settings.serviceChargeRate),
      cleaningFeeAmount: settings.cleaningFeeAmount ? Number(settings.cleaningFeeAmount) : null,
      resortFeeAmount: settings.resortFeeAmount ? Number(settings.resortFeeAmount) : null,
      depositPercentage: settings.depositPercentage ? Number(settings.depositPercentage) : null,
      minPartialPayment: settings.minPartialPayment ? Number(settings.minPartialPayment) : null,
    };
  } catch (error) {
    console.error('Error fetching booking settings:', error);
    return null;
  }
}
