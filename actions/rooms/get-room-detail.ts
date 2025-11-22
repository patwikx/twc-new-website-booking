'use server';

import { prisma } from '@/lib/prisma';

export interface RoomDetailData {
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
  property: {
    id: string;
    name: string;
    slug: string;
    location: string;
    mainImage: string;
  };
}

export async function getRoomDetail(
  propertySlug: string,
  roomSlug: string
): Promise<RoomDetailData | null> {
  try {
    const room = await prisma.room.findFirst({
      where: {
        slug: roomSlug,
        isActive: true,
        property: {
          slug: propertySlug,
          isActive: true,
        },
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
        property: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            mainImage: true,
          },
        },
      },
    });

    if (!room) {
      return null;
    }

    // Convert Decimal to number for client component compatibility
    return {
      ...room,
      basePrice: Number(room.basePrice),
    };
  } catch (error) {
    console.error('Error fetching room detail:', error);
    return null;
  }
}
