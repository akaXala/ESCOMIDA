import { NextResponse } from 'next/server';
import pool from '@/config/database';

export const DELETE = async (req: Request) => {
    try {
        const { id_item } = await req.json();
        if (!id_item) {
            return NextResponse.json({ error: 'id_item requerido' }, { status: 400 });
        }

        const deleteQuery = `DELETE FROM item WHERE id_item = $1 RETURNING id_item;`;
        const result = await pool.query(deleteQuery, [id_item]);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
};