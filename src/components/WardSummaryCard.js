import styles from './WardSummaryCard.module.css';

export default function WardSummaryCard({ wardCode, rooms }) {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.status === 'ISI').length;
    const available = rooms.filter(r => r.status === 'KOSONG').length;
    const booked = rooms.filter(r => r.status === 'DIBOOKING').length;
    const cleaning = rooms.filter(r => r.status === 'DIBERSIHKAN').length;

    const occupiedPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;

    // Generate dot visualization
    const renderDots = () => {
        return rooms.map((room, index) => {
            let dotClass = styles.dotAvailable;
            if (room.status === 'ISI') dotClass = styles.dotOccupied;
            else if (room.status === 'DIBOOKING') dotClass = styles.dotBooked;
            else if (room.status === 'DIBERSIHKAN') dotClass = styles.dotCleaning;

            return (
                <span
                    key={room.kd_kamar}
                    className={`${styles.dot} ${dotClass}`}
                    title={`${room.kd_kamar} - ${room.status}`}
                />
            );
        });
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.wardName}>{wardCode}</h2>
                <div className={styles.counter}>
                    <span className={styles.occupied}>{occupied}</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.total}>{total}</span>
                </div>
            </div>

            <div className={styles.label}>TERISI</div>

            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${occupiedPercentage}%` }}
                />
                <span className={styles.percentage}>{occupiedPercentage}%</span>
            </div>

            <div className={styles.dotsContainer}>
                {renderDots()}
            </div>

            <div className={styles.footer}>
                <div className={styles.stat}>
                    <span className={styles.statDot + ' ' + styles.dotAvailable} />
                    <span>{available}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statDot + ' ' + styles.dotOccupied} />
                    <span>{occupied}</span>
                </div>
                {booked > 0 && (
                    <div className={styles.stat}>
                        <span className={styles.statDot + ' ' + styles.dotBooked} />
                        <span>{booked}</span>
                    </div>
                )}
                {cleaning > 0 && (
                    <div className={styles.stat}>
                        <span className={styles.statDot + ' ' + styles.dotCleaning} />
                        <span>{cleaning}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
