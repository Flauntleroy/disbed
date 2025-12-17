"use client";

import { useState, useEffect } from 'react';
import TVDashboard from '@/components/TVDashboard';

const REFRESH_INTERVAL = 30000; // 30 detik

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchRooms, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a365d',
        color: '#fff',
        fontSize: '2rem'
      }}>
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a365d',
        color: '#fff',
        fontSize: '1.5rem',
        gap: '1rem'
      }}>
        <div>❌ Error: {error}</div>
        <button
          onClick={fetchRooms}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            background: '#3182ce',
            color: '#fff'
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return <TVDashboard rooms={rooms} />;
}
