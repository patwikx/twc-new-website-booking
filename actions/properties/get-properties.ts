'use server';

import { prisma } from '@/lib/prisma';

export interface PropertyData {
  id: string;
  name: string;
  slug: string;
  location: string;
  tagline: string;
  description: string;
  mainImage: string;
  order: number;
  amenities: {
    id: string;
    name: string;
    icon: string | null;
    order: number;
  }[];
  images: {
    id: string;
    url: string;
    caption: string | null;
    order: number;
  }[];
  rooms: {
    id: string;
    name: string;
    basePrice: number;
  }[];
}

export async function getProperties(): Promise<PropertyData[]> {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
      include: {
        amenities: {
          orderBy: {
            order: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        rooms: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            basePrice: true,
          },
          orderBy: {
            basePrice: 'asc',
          },
          take: 1, // Get the cheapest room for "starting from" price
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Convert Decimal to number for client component compatibility
    return properties.map((property) => ({
      ...property,
      rooms: property.rooms.map((room) => ({
        ...room,
        basePrice: Number(room.basePrice),
      })),
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}
