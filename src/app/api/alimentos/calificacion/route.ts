import { NextResponse } from 'next/server';
import pool from '@/config/database';

// GET /api/alimentos/calificacion?id_alimento=xx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_alimento = searchParams.get('id_alimento');
    if (!id_alimento) {
      return NextResponse.json({ success: false, message: 'Falta id_alimento' }, { status: 400 });
    }
    // Usar la vista promedio_puntuacion
    const queryText = `SELECT promedio_puntuacion FROM promedio_puntuacion WHERE id_alimento = $1`;
    const { rows } = await pool.query(queryText, [id_alimento]);
    return NextResponse.json({ success: true, promedio: rows[0]?.promedio_puntuacion ?? null });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error al obtener calificación', error: error.message }, { status: 500 });
  }
}

// POST /api/alimentos/calificacion { ids: [1,2,3] }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'Faltan ids' }, { status: 400 });
    }
    // Consulta usando la vista para todos los ids
    const query = `SELECT id_alimento, promedio_puntuacion FROM promedio_puntuacion WHERE id_alimento = ANY($1)`;
    const { rows } = await pool.query(query, [ids]);
    // Mapear resultados a objeto { id: promedio }
    const ratings: { [id: number]: number | null } = {};
    for (const row of rows) {
      ratings[row.id_alimento] = parseFloat(row.promedio_puntuacion);
    }
    // Para los que no tienen reseña, poner null
    ids.forEach((id: number) => {
      if (!(id in ratings)) ratings[id] = null;
    });
    return NextResponse.json({ success: true, ratings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error al obtener calificaciones', error: error.message }, { status: 500 });
  }
}
