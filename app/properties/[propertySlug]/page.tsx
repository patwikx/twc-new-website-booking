import { notFound } from 'next/navigation';
import { getPropertyDetail } from '@/actions/properties/get-property-detail';
import { getSiteSettings } from '@/actions/site/get-site-settings';
import PropertyDetailClient from '@/components/property-detail-client';

interface PropertyPageProps {
  params: Promise<{
    propertySlug: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { propertySlug } = await params;
  
  const [property, siteSettings] = await Promise.all([
    getPropertyDetail(propertySlug),
    getSiteSettings(),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <PropertyDetailClient
      property={property}
      siteSettings={siteSettings}
    />
  );
}
