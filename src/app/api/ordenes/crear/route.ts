import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async () => {
    try {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
        }

        // 1. Obtener el carrito del usuario
        const carritoRes = await pool.query(
            "SELECT id_carrito FROM carrito WHERE id = $1 LIMIT 1",
            [userId]
        );
        if (carritoRes.rowCount === 0) {
            return NextResponse.json({ success: false, error: "No hay carrito" }, { status: 404 });
        }
        const id_carrito = carritoRes.rows[0].id_carrito;

        // 2. Obtener los items del carrito
        const itemsRes = await pool.query(
            "SELECT * FROM item WHERE id_carrito = $1",
            [id_carrito]
        );
        if (itemsRes.rowCount === 0) {
            return NextResponse.json({ success: false, error: "El carrito está vacío" }, { status: 400 });
        }

        // 3. Calcular el precio total
        const precio_total = itemsRes.rows.reduce((sum, item) => sum + Number(item.precio_final), 0);

        // 4. Crear el pedido
        const pedidoRes = await pool.query(
            "INSERT INTO pedidos (estatus, precio_total, id) VALUES ($1, $2, $3) RETURNING id_pedido",
            ['En espera', precio_total, userId]
        );
        const id_pedido = pedidoRes.rows[0].id_pedido;

        // 5. Actualizar los items para que apunten al pedido y ya no al carrito
        await pool.query(
            "UPDATE item SET id_pedido = $1, id_carrito = NULL WHERE id_carrito = $2",
            [id_pedido, id_carrito]
        );

        return NextResponse.json({ success: true, id_pedido }, { status: 201 });
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
    }
};