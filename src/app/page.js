import TVDashboard from '@/components/TVDashboard';
import roomsData from '@/data/rooms.json';

export default function Home() {
  return <TVDashboard rooms={roomsData} />;
}
