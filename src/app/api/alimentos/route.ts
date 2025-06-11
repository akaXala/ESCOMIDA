import { NextResponse } from 'next/server';
import pool from '@/config/database';   // Conexión a PostgreSQL

export const GET = async () => {
    try {
        const query = `
            SELECT id, nombre, precio, calorias FROM alimento
        `;
        const result = await pool.query(query);

        // Retorna los resultados como JSON
        return NextResponse.json(
            { success: true, data: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en obtener alimentos:", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );    
    }
}