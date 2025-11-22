'use server';

import { prisma } from '@/lib/prisma';

export interface RoomByIdData {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  property: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getRoomById(roomId: string): Promise<RoomByIdData | null> {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        property: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!room) {
      return null;
    }

    return {
      id: room.id,
      name: room.name,
      slug: room.slug,
      basePrice: Number(room.basePrice),
      property: room.property,
    };
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    return null;
  }
}
