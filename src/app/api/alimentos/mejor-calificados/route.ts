import { NextResponse } from 'next/server';
import pool from '@/config/database';

export async function GET() {
  try {
    // Consulta para obtener los 10 alimentos mejor calificados (por promedio de puntuación y cantidad de reseñas)
    const query = `
      SELECT a.id_alimento, a.nombre, a.precio, a.calorias, a.imagen, 
             AVG(r.puntuacion) AS promedio, COUNT(r.puntuacion) AS total_resenas
      FROM Alimento a
      JOIN reseña r ON a.id_alimento = r.id_alimento
      GROUP BY a.id_alimento
      HAVING COUNT(r.puntuacion) > 0
      ORDER BY promedio DESC, total_resenas DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(query);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error al obtener mejor calificados', error: error.message }, { status: 500 });
  }
}
