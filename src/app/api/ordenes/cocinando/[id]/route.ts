import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const PUT = async (_req: Request, { params }: { params: { id: string } }) => {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }

    const id_pedido = parseInt(params.id, 10);
    if (isNaN(id_pedido)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
    }

    const query = `UPDATE pedidos SET estatus = 'Cocinando' WHERE id_pedido = $1 RETURNING *`;
    console.log(query);
    const result = await pool.query(query, [id_pedido]);
  

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, mensaje: "Pedido en preparacion", pedido: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al preparar pedido:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
