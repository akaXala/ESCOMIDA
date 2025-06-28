import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

export async function DELETE(request: Request) {
  try {
    const { id_pedido } = await request.json();
    if (!id_pedido) {
      return NextResponse.json({ success: false, message: 'Falta id_pedido' }, { status: 400 });
    }

    // Eliminar los items asociados al pedido
    await pool.query('DELETE FROM item WHERE id_pedido = $1', [id_pedido]);
    // Eliminar el pedido
    await pool.query('DELETE FROM pedidos WHERE id_pedido = $1', [id_pedido]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error al cancelar el pedido' }, { status: 500 });
  }
}
