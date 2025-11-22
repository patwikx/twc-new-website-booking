'use server';

import { prisma } from '@/lib/prisma';

export interface AvailableFee {
  id: string;
  name: string;
  description: string | null;
  feeType: string;
  amount: number;
  isPercentage: boolean;
  isPerNight: boolean;
  isPerGuest: boolean;
  isOptional: boolean;
}

export async function getAvailableFees(
  propertyId: string
): Promise<AvailableFee[]> {
  try {
    const fees = await prisma.additionalFee.findMany({
      where: {
        isActive: true,
        OR: [
          { applyToAllProperties: true },
          { propertyIds: { has: propertyId } },
        ],
      },
      orderBy: {
        order: 'asc',
      },
    });

    return fees.map((fee) => ({
      id: fee.id,
      name: fee.name,
      description: fee.description,
      feeType: fee.feeType,
      amount: Number(fee.amount),
      isPercentage: fee.isPercentage,
      isPerNight: fee.isPerNight,
      isPerGuest: fee.isPerGuest,
      isOptional: fee.isOptional,
    }));
  } catch (error) {
    console.error('Error fetching available fees:', error);
    return [];
  }
}
