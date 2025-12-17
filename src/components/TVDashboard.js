"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './TVDashboard.module.css';

const SCROLL_INTERVAL = 50;
const VISIBLE_ROWS = 12;
const ROW_HEIGHT = 60;
const LOCALSTORAGE_KEY = 'disbed_excluded_wards';

export default function TVDashboard({ rooms }) {
    const [scrollOffset, setScrollOffset] = useState(0);
    const tableRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);


    const [showSettings, setShowSettings] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const clickTimerRef = useRef(null);
    const [excludedWards, setExcludedWards] = useState([]);


    useEffect(() => {
        const saved = localStorage.getItem(LOCALSTORAGE_KEY);
        if (saved) {
            try {
                setExcludedWards(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse excluded wards:', e);
            }
        }
    }, []);


    const saveExcludedWards = (wards) => {
        setExcludedWards(wards);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(wards));
    };


    const handleSecretClick = () => {
        setClickCount(prev => prev + 1);

        if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
        }

        clickTimerRef.current = setTimeout(() => {
            setClickCount(0);
        }, 2000);

        if (clickCount >= 2) {
            setShowSettings(true);
            setClickCount(0);
        }
    };


    const allWards = useMemo(() => {
        const wardMap = new Map();
        rooms.forEach(room => {
            if (!wardMap.has(room.kd_bangsal)) {
                wardMap.set(room.kd_bangsal, room.nm_bangsal || room.kd_bangsal);
            }
        });
        return Array.from(wardMap.entries())
            .map(([code, name]) => ({ code, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [rooms]);


    const toggleWardExclusion = (wardCode) => {
        if (excludedWards.includes(wardCode)) {
            saveExcludedWards(excludedWards.filter(w => w !== wardCode));
        } else {
            saveExcludedWards([...excludedWards, wardCode]);
        }
    };


    const wardData = useMemo(() => {
        const groups = {};
        rooms.forEach(room => {

            if (excludedWards.includes(room.kd_bangsal)) return;

            if (!groups[room.kd_bangsal]) {
                groups[room.kd_bangsal] = {
                    code: room.kd_bangsal,
                    name: room.nm_bangsal || room.kd_bangsal,
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
        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
    }, [rooms, excludedWards]);


    const stats = useMemo(() => {
        const filteredRooms = rooms.filter(r => !excludedWards.includes(r.kd_bangsal));
        return {
            total: filteredRooms.length,
            available: filteredRooms.filter(r => r.status === 'KOSONG').length,
            occupied: filteredRooms.filter(r => r.status === 'ISI').length,
            booked: filteredRooms.filter(r => r.status === 'DIBOOKING').length,
        };
    }, [rooms, excludedWards]);


    useEffect(() => {
        if (wardData.length <= VISIBLE_ROWS || isPaused || showSettings) return;

        const totalHeight = wardData.length * ROW_HEIGHT;

        const timer = setInterval(() => {
            setScrollOffset(prev => {
                if (prev >= totalHeight) {
                    return prev - totalHeight;
                }
                return prev + 1;
            });
        }, SCROLL_INTERVAL);

        return () => clearInterval(timer);
    }, [wardData.length, isPaused, showSettings]);




    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const getStatusBadge = (ward) => {
        const availablePercent = (ward.kosong / ward.total) * 100;
        if (availablePercent === 0) return { text: 'PENUH', className: styles.statusCritical };
        if (availablePercent <= 20) return { text: 'HAMPIR PENUH', className: styles.statusWarning };
        return { text: 'TERSEDIA', className: styles.statusNormal };
    };

    return (
        <div className={styles.container}>
            {showSettings && (
                <div className={styles.settingsOverlay} onClick={() => setShowSettings(false)}>
                    <div className={styles.settingsModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.settingsHeader}>
                            <h2>⚙️ Pengaturan Tampilan</h2>
                            <button className={styles.closeBtn} onClick={() => setShowSettings(false)}>✕</button>
                        </div>
                        <div className={styles.settingsBody}>
                            <h3>Sembunyikan Bangsal</h3>
                            <p className={styles.settingsHint}>Centang bangsal yang ingin disembunyikan dari tampilan</p>
                            <div className={styles.wardList}>
                                {allWards.map(ward => (
                                    <label key={ward.code} className={styles.wardItem}>
                                        <input
                                            type="checkbox"
                                            checked={excludedWards.includes(ward.code)}
                                            onChange={() => toggleWardExclusion(ward.code)}
                                        />
                                        <span>{ward.name}</span>
                                        <span className={styles.wardCode}>{ward.code}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.settingsFooter}>
                            <span>{excludedWards.length} bangsal disembunyikan</span>
                            <button
                                className={styles.resetBtn}
                                onClick={() => saveExcludedWards([])}
                            >
                                Reset Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>KETERSEDIAAN KAMAR</h1>
                    <p className={styles.subtitle}>RUMAH SAKIT</p>
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
                    <div className={styles.clock} suppressHydrationWarning>{formatTime(currentTime)}</div>
                    <div className={styles.date} suppressHydrationWarning>{formatDate(currentTime)}</div>
                </div>
            </header>

            <div className={styles.tableHeader}>
                <div className={styles.colBangsal}>BANGSAL</div>
                <div className={styles.colKapasitas}>KAPASITAS</div>
                <div className={styles.colTersedia}>TERSEDIA</div>
                <div className={styles.colTerisi}>TERISI</div>
                <div className={styles.colBooked}>BOOKING</div>
                <div className={styles.colStatus}>STATUS</div>
            </div>

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
                                <span className={styles.bangsalCode}>{ward.name}</span>
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
                                <span className={`${styles.statusBadge} ${getStatusBadge(ward).className}`}>
                                    {getStatusBadge(ward).text}
                                </span>
                            </div>
                        </div>
                    ))}
                    {wardData.length > VISIBLE_ROWS && Array.from({ length: 10 }, (_, setIndex) =>
                        wardData.map((ward, index) => (
                            <div
                                key={`dup-${setIndex}-${ward.code}`}
                                className={`${styles.tableRow} ${index % 2 === 0 ? styles.rowEven : styles.rowOdd}`}
                            >
                                <div className={styles.colBangsal}>
                                    <span className={styles.bangsalCode}>{ward.name}</span>
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
                                    <span className={`${styles.statusBadge} ${getStatusBadge(ward).className}`}>
                                        {getStatusBadge(ward).text}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

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
                <div
                    className={styles.footerInfo}
                    onClick={handleSecretClick}
                    style={{ cursor: 'default', userSelect: 'none' }}
                >
                    Data diperbarui secara real-time
                </div>
            </footer>
        </div>
    );
}
