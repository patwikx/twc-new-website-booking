import { getProperties } from '@/actions/properties/get-properties';
import PropertiesListClient from '@/components/properties-list-client';

export default async function PropertiesPage() {
  const properties = await getProperties();

  return <PropertiesListClient properties={properties} />;
}
