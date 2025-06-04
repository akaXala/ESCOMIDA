import { NextRequest, NextResponse } from 'next/server';

// Conexion DB
import pool from '@/config/database';

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ success: true, timestamp: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection error' },
      { status: 500 }
    );
  }
}