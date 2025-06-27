import { NextResponse } from 'next/server';
import pool from '@/config/database';   // Conexión a PostgreSQL

export const POST = async (req: Request) => {
    try {
        const { id_item } = await req.json();
        if (!id_item) {
            return NextResponse.json({ error: 'id_item requerido' }, { status: 400 });
        }

        // Incrementa la cantidad y devuelve la nueva cantidad
        const updateQuery = `
            UPDATE item
            SET cantidad = cantidad + 1
            WHERE id_item = $1
            RETURNING cantidad, precio_final;
        `;
        const result = await pool.query(updateQuery, [id_item]);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ 
            cantidad: result.rows[0].cantidad,
            precio_final: result.rows[0].precio_final
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}