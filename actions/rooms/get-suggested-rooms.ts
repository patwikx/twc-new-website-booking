'use server';

import { prisma } from '@/lib/prisma';

export interface SuggestedRoom {
  id: string;
  name: string;
  slug: string;
  type: string;
  basePrice: number;
  maxGuests: number;
  size: number;
  mainImage: string;
  propertySlug: string;
  totalRooms: number;
}

export async function getSuggestedRooms(
  currentRoomId: string,
  propertyId: string,
  limit: number = 3
): Promise<SuggestedRoom[]> {
  try {
 
    
    // First, try to get rooms from the same property
    let rooms = await prisma.room.findMany({
      where: {
        propertyId,
        id: { not: currentRoomId },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        basePrice: true,
        maxGuests: true,
        size: true,
        totalRooms: true,
        images: {
          select: {
            url: true,
          },
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        property: {
          select: {
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: {
        basePrice: 'asc',
      },
    });

    // If no rooms found in same property, get rooms from other properties
    if (rooms.length === 0) {

      rooms = await prisma.room.findMany({
        where: {
          propertyId: { not: propertyId },
          id: { not: currentRoomId },
          isActive: true,
          property: {
            isActive: true,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          basePrice: true,
          maxGuests: true,
          size: true,
          totalRooms: true,
          images: {
            select: {
              url: true,
            },
            orderBy: {
              order: 'asc',
            },
            take: 1,
          },
          property: {
            select: {
              slug: true,
            },
          },
        },
        take: limit,
        orderBy: {
          basePrice: 'asc',
        },
      });
    }

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      slug: room.slug,
      type: room.type,
      basePrice: room.basePrice.toNumber(),
      maxGuests: room.maxGuests,
      size: room.size,
      mainImage: room.images[0]?.url || '/placeholder-room.jpg',
      propertySlug: room.property.slug,
      totalRooms: room.totalRooms,
    }));
  } catch (error) {
    console.error('Error fetching suggested rooms:', error);
    return [];
  }
}
