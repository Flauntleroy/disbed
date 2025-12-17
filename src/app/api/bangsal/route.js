import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const bangsal = await query(`
            SELECT 
                kd_bangsal,
                nm_bangsal,
                status
            FROM bangsal
            WHERE status = '1'
            ORDER BY nm_bangsal
        `);

        return NextResponse.json(bangsal);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bangsal' },
            { status: 500 }
        );
    }
}
