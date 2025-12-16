"use client";

import { useState, useMemo } from 'react';
import RoomCard from './RoomCard';
import styles from './Dashboard.module.css';

export default function Dashboard({ rooms }) {
    const [selectedClass, setSelectedClass] = useState('ALL');

    // Stats calculation
    const stats = useMemo(() => {
        return {
            total: rooms.length,
            available: rooms.filter(r => r.status === 'KOSONG').length,
            occupied: rooms.filter(r => r.status === 'ISI').length,
            booked: rooms.filter(r => r.status === 'DIBOOKING').length,
        };
    }, [rooms]);

    // Unique classes for filter
    const classes = useMemo(() => {
        const unique = [...new Set(rooms.map(r => r.kelas))];
        return ['ALL', ...unique.sort()];
    }, [rooms]);

    // Filtered rooms
    const filteredRooms = useMemo(() => {
        if (selectedClass === 'ALL') return rooms;
        return rooms.filter(r => r.kelas === selectedClass);
    }, [selectedClass, rooms]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Ketersediaan Kamar</h1>
                <p className={styles.subtitle}>Real-time Dashboard</p>
            </header>

            {/* Stats Section */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statTotal}`}>
                    <div className={styles.statValue}>{stats.total}</div>
                    <div className={styles.statLabel}>Total Bed</div>
                </div>
                <div className={`${styles.statCard} ${styles.statAvailable}`}>
                    <div className={styles.statValue}>{stats.available}</div>
                    <div className={styles.statLabel}>Tersedia</div>
                </div>
                <div className={`${styles.statCard} ${styles.statOccupied}`}>
                    <div className={styles.statValue}>{stats.occupied}</div>
                    <div className={styles.statLabel}>Terisi</div>
                </div>
                <div className={`${styles.statCard} ${styles.statBooked}`}>
                    <div className={styles.statValue}>{stats.booked}</div>
                    <div className={styles.statLabel}>Booked/Lainnya</div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filterBar}>
                {classes.map((cls) => (
                    <button
                        key={cls}
                        className={`${styles.filterButton} ${selectedClass === cls ? styles.active : ''}`}
                        onClick={() => setSelectedClass(cls)}
                    >
                        {cls === 'ALL' ? 'Semua Kelas' : cls}
                    </button>
                ))}
            </div>

            {/* Room Grid */}
            {filteredRooms.length > 0 ? (
                <div className={styles.grid}>
                    {filteredRooms.map((room) => (
                        <RoomCard key={room.kd_kamar} room={room} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    Tidak ada kamar ditemukan untuk filter ini.
                </div>
            )}
        </div>
    );
}
