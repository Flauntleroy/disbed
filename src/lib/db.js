import mysql from 'mysql2/promise';

// Database connection pool (read-only)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

export default pool;
