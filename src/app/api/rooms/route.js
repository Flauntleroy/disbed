import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { excludedRooms, excludedWards } from '@/config/excludeConfig';

export async function GET() {
    try {
        let rooms = await query(`
            SELECT 
                k.kd_kamar,
                k.kd_bangsal,
                k.kelas,
                k.trf_kamar,
                k.status,
                b.nm_bangsal,
                b.status as bangsal_status
            FROM kamar k
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            WHERE b.status = '1'
            ORDER BY k.kd_bangsal, k.kd_kamar
        `);

        // Filter excluded rooms dan wards
        rooms = rooms.filter(room => {
            // Exclude berdasarkan kode kamar
            if (excludedRooms.includes(room.kd_kamar)) return false;
            // Exclude berdasarkan kode bangsal
            if (excludedWards.includes(room.kd_bangsal)) return false;
            return true;
        });

        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}
