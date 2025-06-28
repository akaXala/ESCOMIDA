import { NextResponse } from 'next/server';
import pool from '@/config/database';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
    }
    const query = `
      SELECT a.id_alimento, a.nombre, a.precio, a.calorias, a.imagen
      FROM Favorito f
      JOIN Alimento a ON f.id_alimento = a.id_alimento
      WHERE f.id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error al obtener favoritos', error: error.message }, { status: 500 });
  }
}
