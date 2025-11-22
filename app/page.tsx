import { getHeroSlides } from '@/actions/hero/get-hero-slides';
import { getSiteSettings } from '@/actions/site/get-site-settings';
import { getContactInfo } from '@/actions/contact/get-contact-info';
import { getServices } from '@/actions/services/get-services';
import { getProperties } from '@/actions/properties/get-properties';
import HotelResortsClient from '@/components/hotel-resorts-client';

export default async function HotelResortsWebsite() {
  const [heroSlides, siteSettings, contactInfo, services, properties] = await Promise.all([
    getHeroSlides(),
    getSiteSettings(),
    getContactInfo(),
    getServices(),
    getProperties(),
  ]);

  return (
    <HotelResortsClient
      heroSlides={heroSlides}
      siteSettings={siteSettings}
      contactInfo={contactInfo}
      services={services}
      properties={properties}
    />
  );
}
