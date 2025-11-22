'use server';

import { prisma } from '@/lib/prisma';

export interface HeroSlideData {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  images: {
    id: string;
    url: string;
    alt: string | null;
    order: number;
  }[];
}

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return slides;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}
