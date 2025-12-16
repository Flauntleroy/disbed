"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { getWardName, isWardActive } from '@/data/wardNames';
import styles from './TVDashboard.module.css';

const SCROLL_INTERVAL = 50; // ms per pixel
const VISIBLE_ROWS = 12; // Jumlah baris yang terlihat sebelum scroll

export default function TVDashboard({ rooms }) {
    const [scrollOffset, setScrollOffset] = useState(0);
    const tableRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Group rooms by ward (bangsal) and calculate stats
    const wardData = useMemo(() => {
        const groups = {};
        rooms.forEach(room => {
            if (!groups[room.kd_bangsal]) {
                groups[room.kd_bangsal] = {
                    code: room.kd_bangsal,
                    total: 0,
                    kosong: 0,
                    isi: 0,
                    booked: 0,
                    cleaning: 0,
                    rooms: [],
                    classes: new Set()
                };
            }
            groups[room.kd_bangsal].total++;
            groups[room.kd_bangsal].rooms.push(room);
            groups[room.kd_bangsal].classes.add(room.kelas);

            if (room.status === 'KOSONG') groups[room.kd_bangsal].kosong++;
            else if (room.status === 'ISI') groups[room.kd_bangsal].isi++;
            else if (room.status === 'DIBOOKING') groups[room.kd_bangsal].booked++;
            else if (room.status === 'DIBERSIHKAN') groups[room.kd_bangsal].cleaning++;
        });
        // Filter hanya bangsal dengan status aktif (status = '1')
        return Object.values(groups)
            .filter(ward => isWardActive(ward.code))
            .sort((a, b) => getWardName(a.code).localeCompare(getWardName(b.code)));
    }, [rooms]);

    // Global stats
    const stats = useMemo(() => ({
        total: rooms.length,
        available: rooms.filter(r => r.status === 'KOSONG').length,
        occupied: rooms.filter(r => r.status === 'ISI').length,
        booked: rooms.filter(r => r.status === 'DIBOOKING').length,
    }), [rooms]);

    // Auto-scroll effect
    useEffect(() => {
        if (wardData.length <= VISIBLE_ROWS || isPaused) return;

        const totalRows = wardData.length;
        const maxOffset = (totalRows - VISIBLE_ROWS + 2) * 60; // 60px per row approx

        const timer = setInterval(() => {
            setScrollOffset(prev => {
                if (prev >= maxOffset) {
                    return 0; // Reset to top
                }
                return prev + 1;
            });
        }, SCROLL_INTERVAL);

        return () => clearInterval(timer);
    }, [wardData.length, isPaused]);

    // Reset scroll when reaching end
    useEffect(() => {
        const totalRows = wardData.length;
        const maxOffset = (totalRows - VISIBLE_ROWS + 2) * 60;

        if (scrollOffset >= maxOffset) {
            const resetTimer = setTimeout(() => setScrollOffset(0), 2000);
            return () => clearTimeout(resetTimer);
        }
    }, [scrollOffset, wardData.length]);

    // Current time
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formatDate = (date) => date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const getStatusClass = (ward) => {
        const occupancyRate = ward.isi / ward.total;
        if (occupancyRate >= 0.9) return styles.statusCritical;
        if (occupancyRate >= 0.7) return styles.statusWarning;
        return styles.statusNormal;
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>KETERSEDIAAN KAMAR</h1>
                    <p className={styles.subtitle}>RSUD H. ABDUL AZIZ MARABAHAN</p>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.statBox}>
                        <span className={styles.statNumber}>{stats.total}</span>
                        <span className={styles.statText}>TOTAL</span>
                    </div>
                    <div className={`${styles.statBox} ${styles.available}`}>
                        <span className={styles.statNumber}>{stats.available}</span>
                        <span className={styles.statText}>TERSEDIA</span>
                    </div>
                    <div className={`${styles.statBox} ${styles.occupied}`}>
                        <span className={styles.statNumber}>{stats.occupied}</span>
                        <span className={styles.statText}>TERISI</span>
                    </div>
                    <div className={`${styles.statBox} ${styles.booked}`}>
                        <span className={styles.statNumber}>{stats.booked}</span>
                        <span className={styles.statText}>BOOKING</span>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.clock}>{formatTime(currentTime)}</div>
                    <div className={styles.date}>{formatDate(currentTime)}</div>
                </div>
            </header>

            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.colBangsal}>BANGSAL</div>
                <div className={styles.colKapasitas}>KAPASITAS</div>
                <div className={styles.colTersedia}>TERSEDIA</div>
                <div className={styles.colTerisi}>TERISI</div>
                <div className={styles.colBooked}>BOOKING</div>
                <div className={styles.colStatus}>STATUS</div>
            </div>

            {/* Table Body with Auto-Scroll */}
            <div
                className={styles.tableBody}
                ref={tableRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    className={styles.tableContent}
                    style={{ transform: `translateY(-${scrollOffset}px)` }}
                >
                    {wardData.map((ward, index) => (
                        <div
                            key={ward.code}
                            className={`${styles.tableRow} ${index % 2 === 0 ? styles.rowEven : styles.rowOdd}`}
                        >
                            <div className={styles.colBangsal}>
                                <span className={styles.bangsalCode}>{getWardName(ward.code)}</span>
                                <span className={styles.bangsalSubcode}>
                                    {[...ward.classes].sort().join(' • ')}
                                </span>
                            </div>
                            <div className={styles.colKapasitas}>
                                <span className={styles.number}>{ward.total}</span>
                            </div>
                            <div className={styles.colTersedia}>
                                <span className={`${styles.number} ${styles.tersedia}`}>{ward.kosong}</span>
                            </div>
                            <div className={styles.colTerisi}>
                                <span className={`${styles.number} ${styles.terisi}`}>{ward.isi}</span>
                            </div>
                            <div className={styles.colBooked}>
                                <span className={`${styles.number} ${styles.booking}`}>{ward.booked}</span>
                            </div>
                            <div className={styles.colStatus}>
                                <span className={`${styles.statusBadge} ${getStatusClass(ward)}`}>
                                    {ward.kosong > 0 ? 'TERSEDIA' : 'PENUH'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.legend}>
                    <span className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.legendGreen}`}></span>
                        TERSEDIA
                    </span>
                    <span className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.legendYellow}`}></span>
                        HAMPIR PENUH
                    </span>
                    <span className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.legendRed}`}></span>
                        PENUH / KRITIS
                    </span>
                </div>
                <div className={styles.footerInfo}>
                    Data diperbarui secara real-time
                </div>
            </footer>
        </div>
    );
}
