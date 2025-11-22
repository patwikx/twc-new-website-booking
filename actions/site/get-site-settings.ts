'use server';

import { prisma } from '@/lib/prisma';

export interface SiteSettingsData {
  id: string;
  siteName: string;
  siteTagline: string;
  establishedYear: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  contactTitle: string;
}

export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
