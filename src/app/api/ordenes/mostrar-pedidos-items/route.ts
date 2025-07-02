import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const GET = async () => {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }

    // Obtenemos los pedidos pendientes de TODOS los usuarios (o puedes filtrar si quieres)
    const query = `
      SELECT 
        p.id_pedido,
        p.estatus,
        p.fecha,
        p.precio_total,
        p.id AS id_usuario,
        u.telefono,
        json_agg(
          json_build_object(
            'id_item', i.id_item,
            'nombre', i.nombre,
            'cantidad', i.cantidad,
            'precio_unitario', i.precio,
            'precio_final', i.precio_final
          )
        ) AS items
      FROM pedidos p
      JOIN usuario u ON p.id = u.id
      LEFT JOIN item i ON p.id_pedido = i.id_pedido
      GROUP BY p.id_pedido, u.telefono
      ORDER BY p.fecha DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json(
      { success: true, pedidos: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener pedidos pendientes:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
