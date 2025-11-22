import { notFound } from 'next/navigation';
import { getRoomDetail } from '@/actions/rooms/get-room-detail';
import { getSiteSettings } from '@/actions/site/get-site-settings';
import RoomDetailClient from '@/components/room-detail-client';

interface RoomPageProps {
  params: Promise<{
    propertySlug: string;
    roomSlug: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { propertySlug, roomSlug } = await params;
  
  const [room, siteSettings] = await Promise.all([
    getRoomDetail(propertySlug, roomSlug),
    getSiteSettings(),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <RoomDetailClient
      room={room}
      siteSettings={siteSettings}
    />
  );
}
