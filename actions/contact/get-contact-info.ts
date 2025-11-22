'use server';

import { prisma } from '@/lib/prisma';

export interface ContactInfoData {
  id: string;
  type: string;
  title: string;
  phone: string;
  email: string;
  order: number;
}

export async function getContactInfo(): Promise<ContactInfoData[]> {
  try {
    const contacts = await prisma.contactInfo.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return contacts;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return [];
  }
}
