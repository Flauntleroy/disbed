import Dashboard from '@/components/Dashboard';
import roomsData from '@/data/rooms.json';

export default function Home() {
  return (
    <main>
      <Dashboard rooms={roomsData} />
    </main>
  );
}
