'use server';

import { prisma } from '@/lib/prisma';

export interface AvailabilityData {
  date: string; // ISO date string
  availableRooms: number;
  isAvailable: boolean;
  priceAdjustment: number | null;
}

export async function checkRoomAvailability(
  roomId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityData[]> {
  try {
    // Get the room to know total rooms
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { totalRooms: true },
    });

    if (!room) {
      return [];
    }

    // Get all dates in range
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get availability records for these dates
    const availabilityRecords = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get bookings for these dates
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            checkInDate: {
              lte: endDate,
            },
            checkOutDate: {
              gte: startDate,
            },
          },
        ],
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
        numberOfRooms: true,
      },
    });

    // Calculate availability for each date
    const availability: AvailabilityData[] = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0];

      // Check if there's a specific availability record
      const availRecord = availabilityRecords.find(
        (record) => record.date.toISOString().split('T')[0] === dateStr
      );

      // Count booked rooms for this date
      const bookedRooms = bookings.reduce((total, booking) => {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const currentDate = new Date(date);

        // Check if this date falls within the booking range
        if (currentDate >= checkIn && currentDate < checkOut) {
          return total + booking.numberOfRooms;
        }
        return total;
      }, 0);

      const totalAvailable = availRecord?.availableRooms ?? room.totalRooms;
      const availableRooms = Math.max(0, totalAvailable - bookedRooms);

      return {
        date: dateStr,
        availableRooms,
        isAvailable: availableRooms > 0,
        priceAdjustment: availRecord?.priceAdjustment
          ? Number(availRecord.priceAdjustment)
          : null,
      };
    });

    return availability;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return [];
  }
}
