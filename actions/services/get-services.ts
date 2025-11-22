'use server';

import { prisma } from '@/lib/prisma';

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  image: string;
  linkText: string;
  linkUrl: string;
  order: number;
}

export async function getServices(): Promise<ServiceData[]> {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}
