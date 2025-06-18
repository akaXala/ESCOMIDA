import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const GET = async () => {
    try {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
        }

        // 1. Obtener el carrito del usuario
        const carritoRes = await pool.query(
            "SELECT * FROM pedidos WHERE id = $1",
            [userId]
        );

        // Retornamos los resultados con un JSON
        return NextResponse.json(
            { success: true, data: carritoRes.rows},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
    }
};