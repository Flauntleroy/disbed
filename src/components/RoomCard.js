import styles from './RoomCard.module.css';

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function RoomCard({ room }) {
    const { kd_kamar, kd_bangsal, trf_kamar, status, kelas } = room;

    // Normalize status for class names (remove spaces if any, though usually single word)
    // Enum: 'ISI','KOSONG','DIBERSIHKAN','DIBOOKING'
    const statusClass = styles[`status${status}`] || styles.statusUnknown;
    const cardStatusClass = styles[status] || '';

    return (
        <div className={`${styles.card} ${cardStatusClass}`}>
            <div className={styles.header}>
                <div>
                    <div className={styles.wardCode}>{kd_bangsal}</div>
                    <div className={styles.roomCode}>{kd_kamar}</div>
                </div>
                <span className={`${styles.badge} ${statusClass}`}>
                    {status}
                </span>
            </div>

            <div className={styles.details}>
                <div className={styles.class}>{kelas}</div>
                <div className={styles.price}>{formatPrice(trf_kamar)}</div>
            </div>
        </div>
    );
}
