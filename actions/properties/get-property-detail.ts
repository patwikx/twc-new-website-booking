'use server';

import { prisma } from '@/lib/prisma';

export interface PropertyDetailData {
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
    slug: string;
    description: string;
    type: string;
    maxGuests: number;
    bedConfiguration: string;
    size: number;
    basePrice: number;
    totalRooms: number;
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
  }[];
}

export async function getPropertyDetail(slug: string): Promise<PropertyDetailData | null> {
  try {
    const property = await prisma.property.findUnique({
      where: {
        slug,
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
          },
          orderBy: {
            basePrice: 'asc',
          },
        },
      },
    });

    if (!property) {
      return null;
    }

    // Convert Decimal to number for client component compatibility
    return {
      ...property,
      rooms: property.rooms.map((room) => ({
        ...room,
        basePrice: Number(room.basePrice),
      })),
    };
  } catch (error) {
    console.error('Error fetching property detail:', error);
    return null;
  }
}
