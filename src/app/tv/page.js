import TVDashboard from '@/components/TVDashboard';
import roomsData from '@/data/rooms.json';

export const metadata = {
    title: 'TV Display - Ketersediaan Kamar',
    description: 'Real-time monitoring ketersediaan kamar rumah sakit',
};

export default function TVPage() {
    return <TVDashboard rooms={roomsData} />;
}
